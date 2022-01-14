using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Vu.RaidFinder.Backend.Models;
using Vu.RaidFinder.Backend.Protos;
using Vu.RaidFinder.Backend.Utilities;
using RaidCode = Vu.RaidFinder.Backend.Models.RaidCode;

namespace Vu.RaidFinder.Backend.Services;

public class RaiderService : Protos.RaiderService.RaiderServiceBase, IObserver<RaidCode>, IDisposable
{
    private readonly ILogger<RaiderService> _logger;
    private readonly IList<Raid> _subscribedRaids;
    private readonly IList<Raid> _raids;
    private readonly IDisposable _unsubscriber;
    private IServerStreamWriter<Protos.RaidCode>? _stream;


    public RaiderService(ILogger<RaiderService> logger, IObservable<RaidCode> provider)
    {
        _logger = logger;
        _subscribedRaids = new List<Raid>();
        _raids = Utils.GetRaids();
        _unsubscriber = provider.Subscribe(this);
    }

    public override async Task StartStream(IAsyncStreamReader<StreamRequest> requestStream, IServerStreamWriter<Protos.RaidCode> responseStream, ServerCallContext context)
    {
        _stream = responseStream;
        try
        {
            while (await requestStream.MoveNext())
            {
                switch (requestStream.Current.MessageType)
                {
                    case StreamRequest.Types.MessageType.Subscribe:
                        Subscribe(requestStream.Current.RaidId);
                        break;

                    case StreamRequest.Types.MessageType.Unsubscribe:
                        Unsubscribe(requestStream.Current.RaidId);
                        break;

                    // Default
                    case StreamRequest.Types.MessageType.Unknown:
                    default:
                        break;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError("Something bad happened", ex);
        }
    }

    private void Subscribe(int raidId)
    {
        var raid = _raids.SingleOrDefault(r => r.Id == raidId);

        if (raid is not null)
            _subscribedRaids.Add(raid);
    }

    private void Unsubscribe(int raidId)
    {
        var raid = _raids.SingleOrDefault(r => r.Id == raidId);

        if (raid is not null)
            _subscribedRaids.Remove(raid);
    }

    public void OnNext(RaidCode value)
    {
        if (ShouldSend(value) && _stream is not null)
            _stream.WriteAsync(new Protos.RaidCode
            {
                Code = value.Code,
                RaidId = value.RaidId,
                TweetTime = Timestamp.FromDateTimeOffset(value.TweetTime)
            });
    }

    private bool ShouldSend(RaidCode code)
    {
        return _subscribedRaids.Any(r => r.Id == code.RaidId);
    }

    // Do nothing
    public void OnCompleted()
    {
    }

    // Do nothing
    public void OnError(Exception error)
    {
    }

    public void Dispose()
    {
        _unsubscriber.Dispose();
    }
}
