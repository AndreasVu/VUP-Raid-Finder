using Microsoft.AspNetCore.Mvc;
using Vu.RaidFinder.Backend.Models;
using Vu.RaidFinder.Backend.Utilities;

namespace Vu.RaidFinder.Backend.Controllers;

[Route("v1/")]
[ApiController]
public class RaidsController : ControllerBase
{
    [Route("available-raids")]
    [HttpGet]
    public ActionResult<IList<Raid>> GetAvailableRaids()
    {
        var raids = Utils.GetRaids();

        return Ok(raids);
    }
}