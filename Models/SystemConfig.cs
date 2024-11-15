namespace LoginApi.Models
{
    public class SystemConfig
    {
        public List<string> AllowedFileFormats { get; set; }
        public int DefaultPrintPageLimit { get; set; }
        public DateTime IssueDate { get; set; }
    }
}