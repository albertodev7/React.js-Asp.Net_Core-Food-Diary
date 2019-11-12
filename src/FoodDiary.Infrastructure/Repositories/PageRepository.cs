using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FoodDiary.Domain.Entities;
using FoodDiary.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FoodDiary.Infrastructure.Repositories
{
    public class PageRepository : IPageRepository
    {
        private readonly FoodDiaryContext _context;

        public PageRepository(FoodDiaryContext context)
        {
            _context = context;
        }

        public IQueryable<Page> Get()
        {
            return _context.Pages.AsQueryable();
        }

        public async Task<Page> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Pages.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<int> CreateAsync(Page page, CancellationToken cancellationToken)
        {
            var entry = _context.Add(page);
            await _context.SaveChangesAsync(cancellationToken);
            return entry.Entity.Id;
        }

        public async Task UpdateAsync(Page page, CancellationToken cancellationToken)
        {
            _context.Update(page);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Page page, CancellationToken cancellationToken)
        {
            _context.Remove(page);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteRangeAsync(ICollection<Page> pages, CancellationToken cancellationToken)
        {
            _context.RemoveRange(pages);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> IsDuplicateAsync(DateTime pageDate, CancellationToken cancellationToken)
        {
            var pagesWithTheSameDate = await _context.Pages.Where(p => p.Date == pageDate)
                .AsNoTracking()
                .ToListAsync();
            return pagesWithTheSameDate.Any();
        }
    }
}
