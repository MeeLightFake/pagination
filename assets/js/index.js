// Pagination

const dom = document
const $rows = dom.querySelector('#rows')
const $pages = dom.querySelector('#pages')
const $previous = dom.querySelector('#previous')
const $next = dom.querySelector('#next')

const req = async (url, config = {}) => {
  try {
    const response = await fetch(url, config)

    if (response.ok !== true) { throw { status: response.status } }
    else { return await response.json() }

  } catch (error) {
    console.error(error.status)
  }
}

const getProducts = (max = 2) => {

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }

  req('./app/get-products.php', config)
    .then(res => {
      let template = ''
      let templatePages = ''

      // Obteniendo productos
      for (let i = 0; i < max; i++) {
        template += `
        <div class="col-lg-3 col-sm-6 mb-3 mb-lg-0">
          <div class="card text-center mx-auto" id="${res[i].id}>
            <img class="img-fluid d-block mx-auto"
            src="${res[i].image}" alt="${res[i].description}">
            <div class="card-body">
              <h5 class="card-title" id="card-title">${res[i].name}</h5>
              <p class="card-text" id="card-text">$${res[i].price}</p>
              <a href="#" class="btn btn-success" id="button">Comprar</a>
            </div>
          </div>
        </div>`
      }

      const status = {
        none: '',
        disabled: 'disabled'
      }

      // previous
      templatePages += `
      <li class="page-item ${res.totalPages > 5 ? status.none : status.disabled}">
        <a class="page-link" href="#" tabindex="-1" aria-disabled="true"
        id="previous">
          Anterior
        </a>
      </li>`

      // nums
      for (let i = 1; i <= res.totalPages; i++) {
        templatePages += `
          <li class="page-item ${i === 1 ? 'active' : ''}" id=${i} data-page=${i}>
            <a class="page-link" href="#" id="num-page">
              ${i}
            </a>
          </li>
        `
      }

      // next
      templatePages += `
      <li class="page-item">
        <a class="page-link" href="#"
        id="next">Siguiente</a>
      </li>`

      $rows.innerHTML = template
      $pages.innerHTML = templatePages
    })
}

// Llamando al método
getProducts()

// Añadiendo clase al botón
dom.addEventListener('click', e => {
  if (e.target.id === 'num-page') {
    const numPageButton = e.target.parentElement
    const buttonsNumPage = dom.querySelectorAll('#num-page')

    for (let i = 0; i < buttonsNumPage.length; i++) {
      if (buttonsNumPage[i].parentElement === numPageButton) {
        buttonsNumPage[i].parentElement.setAttribute('class', 'page-item active')
      } else {
        buttonsNumPage[i].parentElement.classList.remove('active')
      }
    }
  }
})

// Enviando por el método POST el número del botón
// al que se dió click
dom.addEventListener('click', e => {
  e.preventDefault()
  const page = e.target.parentElement.dataset.page
  const formData = new FormData()

  if (page) {
    formData.append('page', page)

    const config = {
      method: 'POST',
      body: formData
    }

    req('./app/search.php', config)
      .then(res => {
        // Llamando al método
        // getProducts(res.totalPages)
        $rows.innerHTML = ''

        let template = ''

        // Obteniendo productos
        for (let i = 0; i < 2; i++) {
          template += `
          <div class="col-lg-3 col-sm-6 mb-3 mb-lg-0">
            <div class="card text-center mx-auto" id="${res[i].id}>
              <img class="img-fluid d-block mx-auto"
              src="${res[i].image}" alt="${res[i].description}">
              <div class="card-body">
                <h5 class="card-title" id="card-title">${res[i].name}</h5>
                <p class="card-text" id="card-text">$${res[i].price}</p>
                <a href="#" class="btn btn-success" id="button">Comprar</a>
              </div>
            </div>
          </div>`
        }

        $rows.innerHTML = template
      })
  }
})
