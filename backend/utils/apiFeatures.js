class APIFeatures {
    constructor(query, queryString) {
        this.query  = query;
        this.queryString = queryString;
        this.totalCount = 0;
    }

    // =============================================
  // FILTERING
  // =============================================

  filter() {
    const queryObj = { ...this.queryString};
    const excludedFiellds = ["page", "sort", "limit","fields","search","q" ];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering: gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in|nin)\b/g, (match) => `$${match}`);

    const paredQuery = JSON.parse(queryStr);

    // Handle array values for $in
   Object.keys(parsedQuery).forEach((key) => {
      if (typeof parsedQuery[key] === "string" && parsedQuery[key].includes(",")) {
        parsedQuery[key] = { $in: parsedQuery[key].split(",") };
      }
    });
 
    this.query = this.query.find(parsedQuery);
    return this;
  }

    // =============================================
  // SEARCH (full-text or regex)
  // =============================================
}