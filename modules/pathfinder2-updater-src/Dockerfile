FROM mcr.microsoft.com/dotnet/sdk:7.0 AS publish
ENV DOTNET_EnableDiagnostics=0
WORKDIR /app
COPY . .
RUN cd CirclesUBI.PathfinderUpdater.Updater && dotnet restore "CirclesUBI.PathfinderUpdater.Updater.csproj"
RUN cd CirclesUBI.PathfinderUpdater.Updater && dotnet build "CirclesUBI.PathfinderUpdater.Updater.csproj" -c Release -o /app/build
RUN cd CirclesUBI.PathfinderUpdater.Updater && dotnet publish "CirclesUBI.PathfinderUpdater.Updater.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:7.0
LABEL org.opencontainers.image.source=https://github.com/circlesland/pathfinder2-updater
ENV DOTNET_EnableDiagnostics=0

WORKDIR /app
COPY --from=publish /app/publish .
RUN chmod +x ./CirclesUBI.PathfinderUpdater.Updater
ENTRYPOINT ["./CirclesUBI.PathfinderUpdater.Updater"]
