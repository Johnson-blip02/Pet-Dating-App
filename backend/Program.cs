using backend.Models;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// MongoDB config
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDb"));

// ✅ Log connection string at startup
var mongoSection = builder.Configuration.GetSection("MongoDb");
var connectionString = mongoSection.GetValue<string>("ConnectionString");
Console.WriteLine("🌐 MongoDB Connection String: " + connectionString);

// Register service
builder.Services.AddSingleton<UserService>();

// ✅ CORS MUST BE ADDED BEFORE BUILD
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ CORS usage here is correct
app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();

app.Run();
