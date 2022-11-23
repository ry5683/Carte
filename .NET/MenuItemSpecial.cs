using Sabio.Models.Domain.MenuItems;
using System;
using System.Collections.Generic;


namespace Sabio.Models.Domain.MenuItemSpecials
{
    public class MenuItemSpecial
    {
        public int Id { get; set; }
        public int MenuItemId { get; set; }
        public string Name { get; set; }
        public string Details { get; set; }
        public int MenuItemSpecialId { get; set; }
        public int MaxQuantity { get; set; }
        public decimal SpecialCost { get; set; }
        public bool IsPublished { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public List<FoodWarningTypes> FoodWarningTypes { get; set; }
    }
}
