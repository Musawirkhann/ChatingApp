using System.Security.Claims;
using System.Text;
using System;
using System.Threading.Tasks;
using ChatingApp.API.Data;
using ChatingApp.API.Dtos;
using ChatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace ChatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly DataContext _context;
        public AuthenticationController(IAuthRepository authRepository, DataContext context,
        IConfiguration config)
        {
            _authRepository = authRepository;
            _config = config;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            registerDto.Username = registerDto.Username.ToLower();

            if (await _authRepository.UserExists(registerDto.Username))
                return BadRequest("UserName is already Exist");

            var User = new User
            {
                UserName = registerDto.Username
            };

            var CareatedUser = await _authRepository.Register(User, registerDto.Password);
            return StatusCode(201);

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var userInDb = await _authRepository.Login(loginDto.Username.ToLower(), loginDto.Password);
            if (loginDto == null)
                return Unauthorized();
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userInDb.Id.ToString()),
                new Claim(ClaimTypes.Name, userInDb.UserName)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
            (_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenhandler = new JwtSecurityTokenHandler();
            var token = tokenhandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenhandler.WriteToken(token)
            });

        }

    }
}