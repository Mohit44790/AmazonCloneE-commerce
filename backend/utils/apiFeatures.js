// =============================================
// API FEATURES CLASS
// =============================================
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.totalCount = 0;
  }

  // =============================================
  // FILTERING
  // =============================================
  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "q",
      "minPrice",
      "maxPrice",
      "minRating",
    ];

    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`
    );

    const parsedQuery = JSON.parse(queryStr);

    // Handle comma-separated values
    Object.keys(parsedQuery).forEach((key) => {
      if (
        typeof parsedQuery[key] === "string" &&
        parsedQuery[key].includes(",")
      ) {
        parsedQuery[key] = {
          $in: parsedQuery[key].split(","),
        };
      }
    });

    this.query = this.query.find(parsedQuery);

    return this;
  }

  // =============================================
  // SEARCH
  // =============================================
  search(fields = []) {
    const searchTerm =
      this.queryString.search || this.queryString.q;

    if (searchTerm && searchTerm.trim()) {
      const sanitized = searchTerm
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (fields.length > 0) {
        const searchConditions = fields.map((field) => ({
          [field]: {
            $regex: sanitized,
            $options: "i",
          },
        }));

        this.query = this.query.find({
          $or: searchConditions,
        });
      } else {
        // MongoDB text index search
        this.query = this.query.find({
          $text: {
            $search: searchTerm.trim(),
          },
        });
      }
    }

    return this;
  }

  // =============================================
  // PRICE RANGE
  // =============================================
  priceRange() {
    const { minPrice, maxPrice } = this.queryString;

    if (minPrice || maxPrice) {
      const priceFilter = {};

      if (minPrice) {
        priceFilter.$gte = parseFloat(minPrice);
      }

      if (maxPrice) {
        priceFilter.$lte = parseFloat(maxPrice);
      }

      this.query = this.query.find({
        price: priceFilter,
      });
    }

    return this;
  }

  // =============================================
  // RATING FILTER
  // =============================================
  ratingFilter() {
    const { minRating } = this.queryString;

    if (minRating) {
      this.query = this.query.find({
        "rating.average": {
          $gte: parseFloat(minRating),
        },
      });
    }

    return this;
  }

  // =============================================
  // SORTING
  // =============================================
  sort() {
    const sortMap = {
      newest: "-createdAt",
      oldest: "createdAt",
      price_low: "price",
      price_high: "-price",
      rating: "-rating.average",
      popularity: "-salesCount",
      "a-z": "name",
      "z-a": "-name",
      featured: "-isFeatured -createdAt",
    };

    if (this.queryString.sort) {
      const sortBy =
        sortMap[this.queryString.sort] ||
        this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // =============================================
  // FIELD LIMITING
  // =============================================
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // =============================================
  // PAGINATION
  // =============================================
  paginate(defaultLimit = 20) {
    const page = Math.max(
      1,
      parseInt(this.queryString.page) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        parseInt(this.queryString.limit) || defaultLimit
      )
    );

    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;
    this.skip = skip;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // =============================================
  // PAGINATION META
  // =============================================
  getPaginationMeta(totalCount) {
    const totalPages = Math.ceil(totalCount / this.limit);

    return {
      currentPage: this.page,
      totalPages,
      totalCount,
      limit: this.limit,
      hasNextPage: this.page < totalPages,
      hasPrevPage: this.page > 1,
      nextPage:
        this.page < totalPages
          ? this.page + 1
          : null,
      prevPage:
        this.page > 1
          ? this.page - 1
          : null,
    };
  }
}

// =============================================
// RESPONSE HELPERS
// =============================================
const sendSuccess = (
  res,
  data = {},
  message = "Success",
  statusCode = 200,
  meta = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...meta,
    data,
  });
};

const sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// =============================================
// CALCULATE CART TOTALS
// =============================================
const calculateCartTotals = (cartItems) => {
  let subtotal = 0;
  let totalDiscount = 0;

  cartItems.forEach((item) => {
    if (!item.product) return;

    const price =
      item.product.finalPrice ||
      item.product.price;

    const originalPrice =
      item.product.price;

    subtotal += price * item.quantity;

    totalDiscount +=
      (originalPrice - price) * item.quantity;
  });

  const shippingCharge =
    subtotal >= 499 ? 0 : 40;

  const taxRate = 18;

  const taxAmount = Math.round(
    (subtotal * taxRate) / 100
  );

  const total =
    subtotal +
    shippingCharge +
    taxAmount;

  return {
    subtotal,
    shippingCharge,
    taxAmount,
    taxRate,
    totalDiscount,
    total,
  };
};

// =============================================
// GENERATE SKU
// =============================================
const generateSKU = (
  name,
  category
) => {
  const nameCode = name
    .substring(0, 3)
    .toUpperCase();

  const catCode = category
    ? category.substring(0, 3).toUpperCase()
    : "PRD";

  const random = Math.floor(
    10000 + Math.random() * 90000
  );

  return `${catCode}-${nameCode}-${random}`;
};

// =============================================
// EXPORTS (ES MODULE)
// =============================================
export {
  APIFeatures,
  sendSuccess,
  sendError,
  calculateCartTotals,
  generateSKU,
};