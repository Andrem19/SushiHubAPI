using API.Entities.OrderAggregate;
using System.Text;

namespace API.Services
{
    public class TelegramService
    {
        public IConfiguration _config { get; }
        public TelegramService(IConfiguration config)
        {
            _config = config;
        }

        public string CombainMassage(Order order)
        {
            var stringBuilder = new StringBuilder();
            for (int i = 0; i < order.OrderItems.Count; i++)
            {
                stringBuilder.Append(order.OrderItems[i].ItemOrdered.ProductName + " ");
                stringBuilder.Append(order.OrderItems[i].Quantity);
                stringBuilder.Append("\n");
            }
            return $"New Order {order.Id}\n" +
                $"Address: {order.ShipToAddress.NumberOfHouse} {order.ShipToAddress.Street}\n" +
                $"{stringBuilder}\n" +
                $"Total Price: {order.total}";
        }
        public async void TelegramMessage(string chatId, string message)
        {
            string botId = _config["TelegramBot"];
            string url = "https://api.telegram.org/bot" + botId + "/sendMessage?chat_id=" + chatId + "&parse_mode=Markdown&text=" + message;
            using (var httpClient = new HttpClient())
            {
                await httpClient.GetAsync(url);
            }
        }
    }
}
