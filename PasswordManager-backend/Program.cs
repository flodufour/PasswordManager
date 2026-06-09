using Microsoft.EntityFrameworkCore;
using PasswordManager_backend.Services;
using PasswordManagerBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// EF Core — MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Encryption
builder.Services.AddSingleton<EncryptionService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS — allow the gateway (and frontend in dev)
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
