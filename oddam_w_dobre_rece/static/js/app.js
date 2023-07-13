document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }

  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }

  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function (e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
    }

    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      // e.preventDefault();
      this.currentStep++;
      this.updateForm();
    }
  }

  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }


  let categories = Array.from(document.querySelectorAll('.category'));
  categories.forEach(function (category) {
    let checkbox = category.querySelector('.checkbox')
    checkbox.addEventListener('click', function () {
      this.parentElement.querySelector('.description').classList.toggle('checkedDonation')
    })
  })

  const nextButton = document.getElementById('step-after-categories');

  nextButton.addEventListener('click', function () {
    let checks = document.getElementsByClassName('checkedDonation');
    let selected = Array.from(checks).map(check => check.dataset.category);

    let categoriesId = document.getElementsByClassName('title');
    Array.from(categoriesId).forEach(categoryId => {
      let ids = categoryId.dataset.categories;

      selected.forEach(selectedId => {
        if (!ids.includes(selectedId)) {
          let hidden = categoryId.parentElement.parentElement.parentElement.parentElement;
          hidden.style.display = 'none';
        }
      });
    });
  });

  const instCheckbox = document.getElementsByClassName('radio')
  Array.from(instCheckbox).forEach(checkbox => {
    checkbox.addEventListener('click', function () {
      checkbox.classList.toggle('checkedInstitution')
    })
  })

  const summary = document.getElementById('summary')
  summary.addEventListener('click', function () {

    const donation = document.getElementsByClassName('checkedDonation');
    const donationName = Array.from(donation).map(donation => donation.dataset.catname);
    const bagsInput = document.querySelector('input[name="bags"]').value;
    const selectedInstitution = document.querySelector('span.checkedInstitution');
    const selectedInstType = selectedInstitution.dataset.type;
    const selectedInstName = selectedInstitution.dataset.name;
    const streetInput = document.querySelector('input[name="address"]');
    const cityInput = document.querySelector('input[name="city"]');
    const zipCodeInput = document.querySelector('input[name="postcode"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const dateInput = document.querySelector('input[name="data"]');
    const timeInput = document.querySelector('input[name="time"]');
    const commentInput = document.querySelector('textarea[name="more_info"]');
    const step5div = document.querySelector('div[data-step="5"]');

    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'summary';

    const formSection1 = document.createElement('div');
    formSection1.className = 'form-section';

    const h4Element1 = document.createElement('h4');
    h4Element1.textContent = 'Oddajesz:';

    const ulElement1 = document.createElement('ul');

    const liElement1 = document.createElement('li');
    const icon1 = document.createElement('span');
    icon1.className = 'icon icon-bag';
    const summaryText1 = document.createElement('span');
    summaryText1.className = 'summary--text';
    summaryText1.textContent = `${bagsInput} worki, ${donationName}`;
    liElement1.appendChild(icon1);
    liElement1.appendChild(summaryText1);

    const liElement2 = document.createElement('li');
    const icon2 = document.createElement('span');
    icon2.className = 'icon icon-hand';
    const summaryText2 = document.createElement('span');
    summaryText2.className = 'summary--text';
    summaryText2.textContent = `Dla ${selectedInstType} "${selectedInstName}" `;
    liElement2.appendChild(icon2);
    liElement2.appendChild(summaryText2);

    ulElement1.appendChild(liElement1);
    ulElement1.appendChild(liElement2);

    formSection1.appendChild(h4Element1);
    formSection1.appendChild(ulElement1);

    const formSection2 = document.createElement('div');
    formSection2.className = 'form-section form-section--columns';

    const column1 = document.createElement('div');
    column1.className = 'form-section--column';

    const h4Element2 = document.createElement('h4');
    h4Element2.textContent = 'Adres odbioru:';

    const ulElement2 = document.createElement('ul');

    const liElement3 = document.createElement('li');
    liElement3.textContent = `${streetInput.value}`;

    const liElement4 = document.createElement('li');
    liElement4.textContent = `${cityInput.value}`;

    const liElement5 = document.createElement('li');
    liElement5.textContent = `${zipCodeInput.value}`;

    const liElement6 = document.createElement('li');
    liElement6.textContent = `${phoneInput.value}`;

    ulElement2.appendChild(liElement3);
    ulElement2.appendChild(liElement4);
    ulElement2.appendChild(liElement5);
    ulElement2.appendChild(liElement6);

    column1.appendChild(h4Element2);
    column1.appendChild(ulElement2);

    const column2 = document.createElement('div');
    column2.className = 'form-section--column';

    const h4Element3 = document.createElement('h4');
    h4Element3.textContent = 'Termin odbioru:';

    const ulElement3 = document.createElement('ul');

    const liElement7 = document.createElement('li');
    liElement7.textContent = `${dateInput.value}`;

    const liElement8 = document.createElement('li');
    liElement8.textContent = `${timeInput.value}`;

    const liElement9 = document.createElement('li');
    liElement9.textContent = `${commentInput.value}`;

    ulElement3.appendChild(liElement7);
    ulElement3.appendChild(liElement8);
    ulElement3.appendChild(liElement9);

    column2.appendChild(h4Element3);
    column2.appendChild(ulElement3);

    formSection2.appendChild(column1);
    formSection2.appendChild(column2);

    summaryDiv.appendChild(formSection1);
    summaryDiv.appendChild(formSection2);

    step5div.appendChild(summaryDiv);
    })


});
