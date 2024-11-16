using Microsoft.OpenApi.Models;
using LoginApi.Services;

namespace LoginApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // Cấu hình Swagger
            services.AddSwaggerGen();
            services.AddMemoryCache();
            services.AddSingleton<UserService>();
            services.AddSingleton<SystemConfigService>();
            services.AddSingleton<PrinterService>();
            services.AddSingleton<HistoryService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                // Sử dụng Swagger trong môi trường phát triển
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Login API v1");
                    c.RoutePrefix = string.Empty; // Swagger ở root URL
                });
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
