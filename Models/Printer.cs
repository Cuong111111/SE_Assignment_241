namespace LoginApi.Models
{
    public class Printer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }  // e.g., "Campus A, Building B, Room 101"
    }

    public class PrinterStatusUpdateRequest
    {
        public int PrinterId { get; set; }
        public bool IsActive { get; set; }
    }
}