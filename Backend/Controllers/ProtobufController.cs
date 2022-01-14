using Microsoft.AspNetCore.Mvc;
using Vu.RaidFinder.Backend.Utilities;

namespace Vu.RaidFinder.Backend.Controllers;

[Route("v1/")]
[ApiController]
public class ProtobufController : ControllerBase
{

    [Route("protobuf")]
    [HttpGet]
    public ActionResult<string> GetAvailableRaids()
    {
        var raids = Utils.GetProtobuf();

        return Ok(raids);
    }
}