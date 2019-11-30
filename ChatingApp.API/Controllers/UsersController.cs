
using System.Threading.Tasks;
using AutoMapper;
using System.Collections.Generic;
using ChatingApp.API.Data;
using ChatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ChatingApp.API.Helpers;

namespace ChatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IChatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IChatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetUser(currentUserId);
            userParams.UserId = currentUserId;
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }
            var users = await _repo.GetUsers(userParams);
            var model = _mapper.Map<IEnumerable<UserListDto>>(users);
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(model);
        }
        // [HttpGet]
        // public async Task<IActionResult> GetUsers()
        // {
        //     var users = await _repo.GetUsers();
        //     var model = _mapper.Map<IEnumerable<UserListDto>>(users);
        //     return Ok(model);
        // }
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            if (user == null)
                return BadRequest();
            var UserModel = _mapper.Map<UserDetailDto>(user);
            return Ok(UserModel);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto updateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _repo.GetUser(id);
            _mapper.Map(updateDto, user);
            if (await _repo.SaveAll())
                return NoContent();
            throw new System.Exception($"User Updating with Id: {id} is not Saved");
        }

    }
}