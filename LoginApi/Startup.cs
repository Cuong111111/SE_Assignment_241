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

            // Phần 1: Thêm CORS và các services khác
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularDevClient",
                    builder =>
                    {
                        builder
                            .WithOrigins("http://localhost:4200")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });

            // Cấu hình Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { 
                    Title = "Login API", 
                    Version = "v1" 
                });
            });

            // Các services khác
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
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Login API v1");
                    c.RoutePrefix = string.Empty;
                });
            }

            // Phần 2: Thêm và sắp xếp middleware
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowAngularDevClient"); // Đặt trước UseAuthorization
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
