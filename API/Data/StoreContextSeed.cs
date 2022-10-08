using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace API.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, UserManager<User> userManager, ILoggerFactory loggerFactory)
        {
            try
            {
                if (!userManager.Users.Any())
                {
                    var user = new User
                    {
                        UserName = "bob",
                        Email = "bob@test.com",
                        AcumDiscount = false,
                        MyRefCode = "2AA625FF01G6",
                        RefCodeOfMyRefer = "2SS675FF00G1",
                        EmailConfirmed = true,
                        Address = new Address
                        {
                            Name = "Bob",
                            NumberOfHouse = "43",
                            Street = "Endsleigh Gardens",
                            City = "Blackpool",
                            PostCode = "FY4 3PA",
                            TelephoneNumber = "5658202"
                        }
                    };

                    await userManager.CreateAsync(user, "Pa$$w0rd");
                    await userManager.AddToRoleAsync(user, "Member");

                    var admin = new User
                    {
                        UserName = "admin",
                        Email = "admin@test.com",
                        MyRefCode = "2SS675FF00G1",
                        AcumDiscount = false,
                        EmailConfirmed = true,
                        Address = new Address
                        {
                            Name = "Bob",
                            NumberOfHouse = "17",
                            Street = "Ormont Ave",
                            City = "Blackpool",
                            PostCode = "FY5 2BT",
                            TelephoneNumber = "5658202"
                        }
                    };

                    await userManager.CreateAsync(admin, "Pa$$w0rd");
                    await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });

                    var moderator = new User
                    {
                        UserName = "moderator",
                        Email = "moderator@test.com",
                        MyRefCode = "2XX627FF01G3",
                        RefCodeOfMyRefer = "2SS675FF00G1",
                        AcumDiscount = false,
                        EmailConfirmed = true,
                        Address = new Address
                        {
                            Name = "Bob",
                            NumberOfHouse = "37",
                            Street = "Stocks Ct",
                            City = "Poulton-le-Fylde",
                            PostCode = "FY6 7TA",
                            TelephoneNumber = "5658202"
                        }
                    };

                    await userManager.CreateAsync(moderator, "Pa$$w0rd");
                    await userManager.AddToRolesAsync(moderator, new[] { "Member", "Moderator" });

                    var delivery = new User
                    {
                        UserName = "delivery",
                        Email = "delivery@test.com",
                        MyRefCode = "4OA565FF01Q5",
                        RefCodeOfMyRefer = "2XX627FF01G3",
                        AcumDiscount = false,
                        EmailConfirmed = true,
                        Address = new Address
                        {
                            Name = "Bob",
                            NumberOfHouse = "6",
                            Street = "Empress Dr",
                            City = "Blackpool",
                            PostCode = "FY2 9SE",
                            TelephoneNumber = "5658202"
                        }
                    };

                    await userManager.CreateAsync(delivery, "Pa$$w0rd");
                    await userManager.AddToRolesAsync(delivery, new[] { "Member", "Delivery" });
                };

                if (!context.Products.Any())
                {
                    var productsData =
                        File.ReadAllText("../API/Data/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);


                    foreach (var item in products)
                    {
                        context.Products.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
                if (!context.Squares.Any())
                {
                    var squaresData =
                        File.ReadAllText("../API/Data/SeedData/squares.json");
                    var squares = JsonSerializer.Deserialize<List<Square>>(squaresData);


                    foreach (var item in squares)
                    {
                        context.Squares.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
                if (!context.PromoCodes.Any())
                {
                    var promoData =
                        File.ReadAllText("../API/Data/SeedData/promo.json");
                    var products = JsonSerializer.Deserialize<List<PromoCodes>>(promoData);
                    foreach (var item in products)
                    {
                        context.PromoCodes.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
                if (!context.Categorys.Any())
                {
                    var categoryData =
                        File.ReadAllText("../API/Data/SeedData/category.json");
                    var category = JsonSerializer.Deserialize<List<Category>>(categoryData);
                    foreach (var item in category)
                    {
                        context.Categorys.Add(item);
                    }
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}
