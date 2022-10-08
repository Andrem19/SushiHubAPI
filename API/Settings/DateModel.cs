namespace API.Settings
{
    public class DateModel
    {
        public int year { get; set; }
        public int month { get; set; }
        public int day { get; set; }
    }
    public class DateFromTo
    {
        public DateModel From { get; set; }
        public DateModel To { get; set; }
    }
}
