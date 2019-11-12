using System;
using Microsoft.AspNetCore.Http;

namespace ChatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");

        }
        public static int CalculateAge(this DateTime datetime)
        {
            var Age = DateTime.Today.Year - datetime.Year;
            if (datetime.AddYears(Age) > DateTime.Today)
                Age--;
            return Age;
        }
    }
}