# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ../pet-dating-app.sln ./
COPY . ./backend/

# Restore and build
WORKDIR /src/backend
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5074

ENTRYPOINT ["dotnet", "backend.dll"]
