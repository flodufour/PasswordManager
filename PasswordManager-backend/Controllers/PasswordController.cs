using Microsoft.AspNetCore.Mvc;

namespace PasswordManager_backend.Controllers
{
    public class PasswordController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
