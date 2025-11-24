// import dotenv
import "dotenv/config";
//import products from "./src/_data/products.js"; // Use ES module import
import slugify from "slugify";

export default async function (eleventyConfig) {
  // create a collection for products
  //eleventyConfig.addGlobalData("products", products); //fix push

  // Add slug filter to slugify product names for URLs
  eleventyConfig.addFilter("slug", (str) => {
    if (!str) return "";
    return slugify(str, {
      lower: true,
      strict: true, // remove special chars
    });
  });

  // avoid processing and watching files
  eleventyConfig.ignores.add("./src/assets/**/*");
  eleventyConfig.watchIgnores.add("./src/assets/**/*");

  // make sure files are physically copied with --serve
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // copy files
  eleventyConfig.addPassthroughCopy("./src/assets/fonts");
  eleventyConfig.addPassthroughCopy("./src/assets/img");
  eleventyConfig.addPassthroughCopy("./src/assets/medias");

  // Eleventy dev server config
  eleventyConfig.setServerOptions({
    port: 3000,
    watch: ["./dist/assets/css/**/*.css", "./dist/assets/js/**/*.js"],
  });
}

export const config = {
  dir: {
    input: "src",
    output: "dist",
  },
};
