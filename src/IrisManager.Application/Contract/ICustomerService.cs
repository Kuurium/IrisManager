using IrisManager.Application.Dtos;

namespace IrisManager.Application.Contract
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerDto>> GetCustomersAsync();
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task<CustomerDto> CreateCustomerAsync(CustomerCreateDto dto);
        Task<bool> UpdateCustomerAsync(int id, CustomerUpdateDto dto);
        Task<bool> DeleteCustomerAsync(int id);
    }
}
