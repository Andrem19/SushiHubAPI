using API.Entities;

namespace API.Helpers
{
    public class MapBasketToDb
    {
        public static BasketItem mapBasket(CustomerBasket basket)
        {
            BasketItem item = new BasketItem();
            item.IdProd = basket.Items[0].IdProd;
            item.PictureUrl = basket.Items[0].PictureUrl;
            item.ProductName = basket.Items[0].ProductName;
            item.Price = basket.Items[0].Price;
            item.Quantity = basket.Items[0].Quantity;
            item.Type = basket.Items[0].Type;
            return item;
        }
    }
}
