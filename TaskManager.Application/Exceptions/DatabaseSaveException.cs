namespace TaskManager.Application.Exceptions;

public class DatabaseSaveException : Exception
{
    public DatabaseSaveException(string message) : base(message) { }
}
