using Microsoft.AspNetCore.Mvc;

namespace Template-API.Controllers
{
    public class Alumno : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
}
