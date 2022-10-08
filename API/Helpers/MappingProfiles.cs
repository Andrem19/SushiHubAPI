using API.Dtos;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.RequestHelpers;
using AutoMapper;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
            .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<CreateProductDto, Product>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateProductDto, Product>()
                .ForMember(d => d.ProductType, o => o.MapFrom(o => o.Type));
            CreateMap<ShippingInfoDto, ShippingInfo>();
            CreateMap<AddressDto, Address>();
            CreateMap<Address, AddressDto>();
            CreateMap<Order, OrderToReturnDto>();
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl));
        }
    }
}