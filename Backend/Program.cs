using Vu.RaidFinder.Backend.Services;
using Vu.RaidFinder.Backend.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// builder.Services.AddGrpc();
builder.Services.AddSignalR();
builder.Services.AddLogging();

//builder.Services.AddMvc();
//builder.Services.AddControllers();
/*builder.Services.AddSwaggerDocument(config =>
{
    config.PostProcess = document =>
    {
        document.Info.Title = "VUP Raid finder";
        document.Info.Description = "Use this to get the protobuf file and the available raids for the gRPC service";
    };
});*/

builder.Services.AddRaidServerServices(builder.Configuration);

builder.Services.AddCorsSettings(builder.Configuration);

var app = builder.Build();

app.UseCors();
app.UseRouting();

// app.MapGrpcService<RaiderService>();

// Swagger
//app.UseOpenApi();
//app.UseSwaggerUi3();

//app.MapControllers();

app.UseWebSockets(Utils.GetWebSocketOptions(builder.Configuration));

app.MapHub<RaidCodeHub>("/raid-code-hub");

app.Run();