import React from 'react'


const inputCls = (err) => `w-full bg-[#0f1117] border rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#FF9900]/50 focus:border-[#FF9900] ${err ? "border-red-500" :"border-white/10"}`;

const TYPES = ["fashion","electronics","home","beauty","sports","books","automotive","grocery","other"];
const GENDERS = ["men","women","unisex","kids"];

const EMPTY_FORM = {
  name:"", description:"", parent:"", type:"other", gender:"",
  displayOrder:"0", isFeatured:false, showInMenu:true, showInHome:false, icon:"",
  metaTitle:"", metaDescription:"",
};

const Category = () => {
  return (
    <div>Category</div>
  )
}

export default Category