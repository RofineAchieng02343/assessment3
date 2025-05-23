// script.js
const jobsContainer = document.getElementById('job-listings');
const filterBar = document.getElementById('filter-bar');
const filtersContainer = document.getElementById('filters');
const clearButton = document.getElementById('clear');

let filters = [];

fetch('./data.json')
  .then(res => res.json())
  .then(data => {
    renderJobs(data);

    function renderJobs(jobs) {
      jobsContainer.innerHTML = '';
      jobs.forEach(job => {
        const tags = [job.role, job.level, ...job.languages, ...job.tools];

        if (filters.length > 0 && !filters.every(filter => tags.includes(filter))) {
          return;
        }

        const jobEl = document.createElement('div');
        jobEl.classList.add('job');
        if (job.featured) jobEl.classList.add('featured');

        jobEl.innerHTML = `
          <div class="info">
            <img src="${job.logo}" alt="${job.company}">
            <div>
              <div class="company">
                <h3>${job.company}</h3>
                ${job.new ? '<span>NEW!</span>' : ''}
                ${job.featured ? '<span>FEATURED</span>' : ''}
              </div>
              <div class="position">${job.position}</div>
              <div class="details">
                <span>${job.postedAt}</span>
                <span>&bull;</span>
                <span>${job.contract}</span>
                <span>&bull;</span>
                <span>${job.location}</span>
              </div>
            </div>
          </div>
          <div class="tags">
            ${tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('')}
          </div>
        `;

        jobsContainer.appendChild(jobEl);
      });

      addEventListeners();
    }

    function addEventListeners() {
      document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
          const tagValue = tag.dataset.tag;
          if (!filters.includes(tagValue)) {
            filters.push(tagValue);
            updateFilters();
            renderJobs(data);
          }
        });
      });
    }

    function updateFilters() {
      filtersContainer.innerHTML = '';
      filters.forEach(f => {
        const filterEl = document.createElement('div');
        filterEl.classList.add('filter');
        filterEl.innerHTML = `
          <span>${f}</span>
          <div class="remove" data-remove="${f}">✕</div>
        `;
        filtersContainer.appendChild(filterEl);
      });

      filterBar.classList.toggle('hidden', filters.length === 0);

      document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', () => {
          filters = filters.filter(f => f !== btn.dataset.remove);
          updateFilters();
          renderJobs(data);
        });
      });
    }

    clearButton.addEventListener('click', () => {
      filters = [];
      updateFilters();
      renderJobs(data);
    });
  });
