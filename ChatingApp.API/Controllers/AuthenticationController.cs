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
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace ChatingApp.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        // private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthenticationController(IConfiguration config, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager) //IAuthRepository authRepository,
        {
            // _authRepository = authRepository;
            _config = config;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {

            // registerDto.Username = registerDto.Username.ToLower();

            // if (await _authRepository.UserExists(registerDto.Username))
            //     return BadRequest("UserName is already Exist");

            var Usercreate = _mapper.Map<User>(registerDto);
            var result = await _userManager.CreateAsync(Usercreate, registerDto.Password);

            //var createdUser = await _authRepository.Register(Usercreate, registerDto.Password);
            var UserReturn = _mapper.Map<UserDetailDto>(Usercreate);
            if (result.Succeeded)
            {
                return CreatedAtRoute("GetUser", new { controller = "Users", id = Usercreate.Id }, UserReturn);
            }
            return BadRequest(result.Errors);

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded)
            {
                var appUser = await _userManager.Users
                                .Include(p => p.Photos)
                                .FirstOrDefaultAsync(u => u.NormalizedUserName == loginDto.Username.ToUpper());
                var userToReturn = _mapper.Map<UserListDto>(appUser);
                return Ok(new
                {
                    token = GenerateJwtToken(appUser).Result,//tokenhandler.WriteToken(token),
                    user = userToReturn
                });
            }
            return Unauthorized();

            // var userInDb = await _authRepository.Login(loginDto.Username.ToLower(), loginDto.Password);
            // if (userInDb == null)
            //     return Unauthorized();
        }
        private async Task<string> GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

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

            return tokenhandler.WriteToken(token);
        }

    }
}