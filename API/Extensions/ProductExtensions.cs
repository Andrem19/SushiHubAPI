using System.Collections.Generic;
using System.Linq;
using API.Dtos;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if (string.IsNullOrEmpty(orderBy)) return query.OrderByDescending(p => p.popularity); 

            query = orderBy switch
            {
                "price" => query.OrderBy(p => (long)p.Price),
                "priceDesc" => query.OrderByDescending(p => (long)p.Price),
                _ => query.OrderByDescending(p => p.popularity)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string types)
        {
            if (types == "All") return query;

            var typeList = new List<string>();

            if (!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.ProductType.ToLower()));

            return query;
        }
    }
}