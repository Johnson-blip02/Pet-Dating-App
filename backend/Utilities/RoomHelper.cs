// Utilities/RoomHelper.cs
namespace backend.Utilities;

public static class RoomHelper
{
    public static string GenerateRoomId(string userA, string userB)
    {
        var sorted = new[] { userA, userB }.OrderBy(id => id).ToArray();
        return $"room_{sorted[0]}_{sorted[1]}";
    }
}
