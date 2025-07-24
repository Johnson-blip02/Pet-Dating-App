using backend.Models;
using backend.Services;
using backend.WebSockets; // Assuming your handler is in this namespace

var builder = WebApplication.CreateBuilder(args);

// MongoDB config
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDb"));

builder.Configuration.AddEnvironmentVariables();

// Log connection string at startup
var mongoSection = builder.Configuration.GetSection("MongoDb");
var connectionString = mongoSection.GetValue<string>("ConnectionString");
Console.WriteLine("🌐 MongoDB Connection String: " + connectionString);

// Register services
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<AccountService>();
builder.Services.AddSingleton<ChatMessageService>();
builder.Services.AddSingleton<ChatWebSocketHandler>(); // Register your WebSocket handler
builder.Services.AddScoped<CloudinaryService>();



// CORS
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

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.UseWebSockets(); // Enable WebSocket support

// WebSocket middleware
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var handler = context.RequestServices.GetRequiredService<ChatWebSocketHandler>();
            await handler.Handle(context, webSocket);
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
    else
    {
        await next();
    }
});

app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();

app.Run();