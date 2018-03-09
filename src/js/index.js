'use strict';

//JSON 
const dataJSON = `[
  {
    "image": "img/avatar.jpg",
    "name": "Иван",
    "surname": "Иванов",
    "date": "01.12.1978",
    "position": "программист",
    "remoteWork": true,
    "city": "г.СПБ",
    "street": "ул.Ленская",
    "house": "д.15",
    "room": "кв.45"
  },
  {
    "image": "img/avatar.jpg",
    "name": "Виктор",
    "surname": "Фролов",
    "date": "01.12.1985",
    "position": "юрист",
    "remoteWork": false,
    "city": "г.СПБ",
    "street": "ул.Хасанская",
    "house": "д.26",
    "room": "кв.15"
  },
  {
    "image": "img/avatar.jpg",
    "name": "Сергей",
    "surname": "Сидоров",
    "date": "01.12.1982",
    "position": "программист",
    "remoteWork": true,
    "city": "г.СПБ",
    "street": "ул.Прилужская",
    "house": "д.36",
    "room": "кв.12"
  },
  {
    "image": "img/avatar.jpg",
    "name": "Георгий",
    "surname": "Смирнов",
    "date": "01.12.1993",
    "position": "техник",
    "remoteWork": false,
    "city": "г.СПБ",
    "street": "ул.Уральская",
    "house": "д.2",
    "room": "кв.40"
  },
  {
    "image": "img/avatar.jpg",
    "name": "Александр",
    "surname": "Войнов",
    "date": "01.12.1996",
    "position": "программист",
    "remoteWork": true,
    "city": "г.СПБ",
    "street": "ул.Ленская",
    "house": "д.15",
    "room": "кв.45"
  },
  {
    "image": "img/avatar.jpg",
    "name": "Роман",
    "surname": "Гаврилов",
    "date": "01.12.1989",
    "position": "программист",
    "remoteWork": true,
    "city": "г.СПБ",
    "street": "ул.Осипенко",
    "house": "д.17",
    "room": "кв.135"
  }
]`;

const data = JSON.parse(dataJSON);
let targetList = [];

class Element {
  constructor(el, beforeEl, ...clName) {
    this.el = el;
    this.clName = clName;
    this.beforeEl = beforeEl; 
  }

  create() {
    let el = document.createElement(this.el);

    for(let i = 0; i < this.clName.length; i++) {
      el.classList.add(this.clName[i]);
    }

    this.beforeEl.appendChild(el);
    return el;
  }
}

class Specialist {
  constructor(image, name, surname, date, age, position, remoteWork, city, street, house, room) {
    this.image = image;
    this.name = name;
    this.surname = surname;
    this.date = date;
    this.age = age;
    this.position = position;
    this.remoteWork = remoteWork;
    this.city = city;
    this.street = street;
    this.house = house;
    this.room = room;
  }

  //Создание записей
  create() {
    let tbody = document.querySelector('.content tbody');
    this.rowInfo = new Element('tr', tbody, 'row-info').create();
    this.imageTD = new Element('td', this.rowInfo, 'image-td').create();
    this.nameTD = new Element('td', this.rowInfo, 'name-td').create().innerHTML = this.name;
    this.surnameTD = new Element('td', this.rowInfo, 'surname-td').create().innerHTML = this.surname;
    this.dateTD = new Element('td', this.rowInfo, 'date-td').create().innerHTML = this.date;
    this.ageTD = new Element('td', this.rowInfo, 'age-td').create().innerHTML = this.age;
    this.positionTD = new Element('td', this.rowInfo, 'position-td').create().innerHTML = this.position;
    this.remoteWorkTD = new Element('td', this.rowInfo, 'remote-work-td').create();
    this.addressTD = new Element('td', this.rowInfo, 'address-td').create().innerHTML = `${this.city} , ${this.street} , ${this.house} , ${this.room}`;

    let image = new Element('img', this.imageTD, 'avatar').create();
    let remoteWork = new Element('input', this.remoteWorkTD, 'remote-work').create();

    image.src = this.image;
    remoteWork.type = 'checkbox';
    remoteWork.checked = this.remoteWork;
    remoteWork.disabled = true;

    Specialist.setBackground();

    this.rowInfo.onclick = (event) => {
      let previousTargetElement = document.querySelector('.row-info-active');

      if (previousTargetElement === null) {
        event.target.parentElement.classList.add('row-info-active');
      } else if (previousTargetElement !== null) {
        previousTargetElement.classList.remove('row-info-active');
        event.target.parentElement.classList.add('row-info-active');
      }

      let redactBtn = document.querySelector('.redact-row-info');
      redactBtn.onclick = () => {

        if (!document.body.contains(document.querySelector('.row-info-active'))) {
          return false;
        }

        Specialist.redact(this);
      };

      let removeBtn = document.querySelector('.remove-row-info');
      removeBtn.onclick = () => {

        if (!document.body.contains(document.querySelector('.row-info-active'))) {
         return false;
        }

        Specialist.remove(this);
      };
    }
  }

  //Чередование цвета фона записей
  static setBackground() {
    let rowInfoList = document.querySelectorAll('.row-info');

    for(let i = 0; i < rowInfoList.length; i++) {

      if (i % 2 !== 0) {
        rowInfoList[i].style.backgroundColor = '#f8f8f9';
      } else {
        rowInfoList[i].style.backgroundColor = '#fcfdfd';
      }
    }
  }

  //Вычесление возраста на основе даты рождения
  static getAge(dateString) {
    let day = parseInt(dateString.substring(0,2));
    let month = parseInt(dateString.substring(3,5));
    let year = parseInt(dateString.substring(6,10));
    let today = new Date();
    let birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { 
          age--;
      }
    return age;
  }

  //Поиск
  static search(pattern) {
    let nameTDList = document.querySelectorAll('.row-info .surname-td');
    let reg = new RegExp(`${pattern}`, 'i');

    for(let i = 0; i < nameTDList.length; i++) {
      nameTDList[i].parentElement.style.display = 'none';
      let result = reg.test(nameTDList[i].innerHTML);

      if (result === true) {
        nameTDList[i].parentElement.style.display = 'table-row';
      } else {
        continue;
      }
    }
  }

  //Очистить поиск
  static searchReset() {
    let rowInfoList = document.querySelectorAll('.row-info');
    let inputSearch = document.querySelector('.search');

    for(let i = 0; i < rowInfoList.length; i++) {
      rowInfoList[i].style.display = 'table-row';
    }

    inputSearch.value = '';
    inputSearch.style.borderColor = '';
    inputSearch.style.color = '';
  }

  //Редактирование записей
  static redact(specialist) {
    let cover = document.querySelector('.cover');
    cover.classList.add('cover-active');
    let specialistForm = document.forms.specialist;
    specialistForm.name.value = specialist.name;
    specialistForm.surname.value = specialist.surname;
    specialistForm.date.value = specialist.date;
    specialistForm.position.value = specialist.position;
    specialistForm.remoteWork.checked = specialist.remoteWork;
    specialistForm.city.value = specialist.city;
    specialistForm.street.value = specialist.street;
    specialistForm.house.value = specialist.house;
    specialistForm.room.value = specialist.room;

    let saveBtn = document.querySelector('.save-btn');

    saveBtn.onclick = () => {
      let checkList = Form.checkForm({
        elem: specialistForm.name,
        pattern: '^[а-яА-ЯёЁa-zA-Z]+$'
      },
      {
        elem: specialistForm.surname,
        pattern: '^[а-яА-ЯёЁa-zA-Z]+$'
      },
      {
        elem: specialistForm.position,
        pattern: '^[а-яА-ЯёЁa-zA-Z]+$'
      },
      {
        elem: specialistForm.date,
        pattern: '^([0-9]{2}).([0-9]{2}).([0-9]{4})$'
      },
      {
        elem: specialistForm.city,
        pattern: '^[а-яА-ЯёЁa-zA-Z.:_-]+$'
      },
      {
        elem: specialistForm.street,
        pattern: '^[а-яА-ЯёЁa-zA-Z0-9.:_-]+$'
      },
      {
        elem: specialistForm.house,
        pattern: '^[а-яА-ЯёЁa-zA-Z0-9.:_-]+$'
      },
      {
        elem: specialistForm.room,
        pattern: '^[а-яА-ЯёЁa-zA-Z0-9.:_-]+$'
      }
    );

      if (checkList.length === 0) {
        specialist.rowInfo.children[1].innerHTML = specialistForm.name.value;
        specialist.rowInfo.children[2].innerHTML = specialistForm.surname.value;
        specialist.rowInfo.children[3].innerHTML = specialistForm.date.value;
        specialist.rowInfo.children[4].innerHTML  = Specialist.getAge(specialistForm.date.value);
        specialist.rowInfo.children[5].innerHTML  = specialistForm.position.value;
        specialist.rowInfo.children[6].children[0].checked  = specialistForm.remoteWork.checked;
        specialist.rowInfo.children[7].innerHTML  = `${specialistForm.city.value} , ${specialistForm.street.value} , ${specialistForm.house.value} , ${specialistForm.room.value}`;
        specialistForm.reset();
        cover.classList.remove('cover-active');
      } else {
        return false;
      }
    }; 
  }

  //Удаление записи
  static remove(specialist) {
    let tbody = document.querySelector('.content tbody');
    tbody.removeChild(specialist.rowInfo);
    Specialist.setBackground();
  }

  //Cортировка данных в столбце
  static sort(sortProps, cancel = false) {
    let rowInfoListForSort = [];
    let rowInfoList = document.querySelectorAll('.row-info');

    for(let i = 0; i < rowInfoList.length; i++) {
      rowInfoListForSort.push(rowInfoList[i]);
    }
    
    let sortGrid = () => {

      if (sortProps.type === 'string' && sortProps.typeSort === 'normal') {
        return rowInfoListForSort.sort((rowA, rowB) => {
          return rowA.cells[sortProps.index].innerHTML > rowB.cells[sortProps.index].innerHTML;
        });
      }

      if (sortProps.type === 'string' && sortProps.typeSort === 'reverse') {
        return rowInfoListForSort.sort((rowA, rowB) => {
          return rowB.cells[sortProps.index].innerHTML > rowA.cells[sortProps.index].innerHTML;
        });
      }

      if (sortProps.type === 'number' && sortProps.typeSort === 'normal') {
        return rowInfoListForSort.sort((rowA, rowB) => {
          return rowA.cells[sortProps.index].innerHTML - rowB.cells[sortProps.index].innerHTML;
        });
      }

      if (sortProps.type === 'number' && sortProps.typeSort === 'reverse') {
        return rowInfoListForSort.sort((rowA, rowB) => {
          return rowB.cells[sortProps.index].innerHTML - rowA.cells[sortProps.index].innerHTML;
        });
      }

      if (sortProps.type === 'boolean' && sortProps.typeSort === 'normal' && sortProps.index === 6) {
        return rowInfoListForSort.sort((rowA, rowB) => {
          return rowA.cells[sortProps.index].children[0].checked - rowB.cells[sortProps.index].children[0].checked;
        });
      }

      if (sortProps.type === 'boolean' && sortProps.typeSort === 'reverse' && sortProps.index === 6) {
        return rowInfoListForSort.sort((rowA, rowB) => {
          return rowB.cells[sortProps.index].children[0].checked - rowA.cells[sortProps.index].children[0].checked;
        });
      }
    };

    let rowInfoSortList = sortGrid();
    let tbody = document.querySelector('.content tbody');

    for(let i = 0; i < rowInfoList.length; i++) {
      tbody.removeChild(rowInfoList[i]);
    }
  
    for(let i = 0; i < rowInfoSortList.length; i++) {
      tbody.appendChild(rowInfoSortList[i]);
    }
  }
}

class Form {
  constructor() {}
  
  //Проверка данных формы
  static checkForm(...inputs) {
    let checkList = [];

    for(let i = 0; i < inputs.length; i++) {
      let reg = new RegExp(inputs[i].pattern);
      let result = reg.exec(inputs[i].elem.value);
      if (result === null) {
        inputs[i].elem.value = 'Не корректные данные';
        inputs[i].elem.style.border = '0.1rem solid red';
        inputs[i].elem.style.color = 'red';
        checkList.push(false);
      } else {
        inputs[i].elem.style.border = '';
        inputs[i].elem.style.color = '';
      }
    }

    return checkList;
  }
}

class Calendar {
  constructor() {}

  //Создание календаря
  createCalendar() {
    let calendar = new Element('div', document.querySelector('.date-block'), 'calendar').create();
    let calendarHeader = new Element('div', calendar, 'calendar-header').create();
    let calendarHeaderContent = new Element('h4', calendarHeader, 'calendar-header-content').create();
    let nextMonthBtn = new Element('span', calendarHeader, 'next-month-btn', 'lnr', 'lnr-chevron-up').create();
    let previousMonthBtn = new Element('span', calendarHeader, 'lnr', 'lnr-chevron-down', 'previous-month-btn').create();
    let previousYearBtn = new Element('span', calendarHeader, 'lnr', 'lnr-chevron-left', 'previous-year-btn').create();
    let nextYearBtn = new Element('span', calendarHeader, 'lnr', 'lnr-chevron-right', 'next-year-btn').create();
    calendarHeaderContent.innerHTML = `${Calendar.getMonthFormat(new Date().getMonth())} ${new Date().getFullYear()}`;
    Calendar.createCalendarDays();
  }

  static getMonthFormat(number) {
    let month;
    let monthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return month = monthName[number];
  }

  static getDaysInMonth(year, month) {
    return 33 - new Date(year, month, 33).getDate();
  }

  static getYearAndMonth() {
    let  yearAndMonth = document.querySelector('.calendar-header-content').innerHTML.split(' ');
    let monthArray = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    return {
      year: parseInt(yearAndMonth[1]),
      month: monthArray.indexOf(yearAndMonth[0])
    }
  }

  static createCalendarDays() {
    let monthCounter = Calendar.getYearAndMonth().month;
    let yearCounter = Calendar.getYearAndMonth().year;
    let calendar = document.querySelector('.calendar');
    let calendarTable = '<table><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th></tr><tr>';

    for(let i = 0; i < Calendar.getDay(Calendar.getYearAndMonth().year, Calendar.getYearAndMonth().month); i++) {
      calendarTable += '<td></td>';
    }


    for(let i = 1; i <= Calendar.getDaysInMonth(Calendar.getYearAndMonth().year, Calendar.getYearAndMonth().month); i++) {
      calendarTable += `<td>${i}</td>`;
      
      if (new Date(Calendar.getYearAndMonth().year, Calendar.getYearAndMonth().month, i).getDay() === 0) {
        calendarTable += '</tr><tr>';
      }
    }

    calendar.innerHTML += calendarTable;

    let calendarHeader = calendar.querySelector('.calendar-header');
    let calendarHeaderContent = calendarHeader.querySelector('.calendar-header-content');
    let nextMonthButton = calendarHeader.querySelector('.next-month-btn');
    let previousMonthButton = calendarHeader.querySelector('.previous-month-btn');
    let nextYearButton = calendarHeader.querySelector('.next-year-btn');
    let previousYearButton = calendarHeader.querySelector('.previous-year-btn');

    previousYearButton.onclick = () => {
      yearCounter--;
      calendar.removeChild(calendar.querySelector('table'));
      calendarHeaderContent.innerHTML = `${Calendar.getMonthFormat(monthCounter)} ${yearCounter}`;
      Calendar.createCalendarDays();
    };
    
    nextYearButton.onclick = () => {
      yearCounter++;
      calendar.removeChild(calendar.querySelector('table'));
      calendarHeaderContent.innerHTML = `${Calendar.getMonthFormat(monthCounter)} ${yearCounter}`;
      Calendar.createCalendarDays();
    };

    previousMonthButton.onclick = () => {
      monthCounter--;

      if (monthCounter < 0 ) {
       monthCounter = 11;
        yearCounter--;
      }

      calendar.removeChild(calendar.querySelector('table'));
      calendarHeaderContent.innerHTML = `${Calendar.getMonthFormat(monthCounter)} ${yearCounter}`;
      Calendar.createCalendarDays();
    };

    nextMonthButton.onclick = () => {
      monthCounter++;

      if (monthCounter > 11 ) {
        monthCounter = 0;
        yearCounter++;
      }

      calendar.removeChild(calendar.querySelector('table'));
      calendarHeaderContent.innerHTML = `${Calendar.getMonthFormat(monthCounter)} ${yearCounter}`;
      Calendar.createCalendarDays();
    };

    let calendarDaysList = calendar.querySelectorAll('.calendar td');
    let calendarTR = calendar.querySelectorAll('.calendar tr');

    for(let i = 0; i < calendarTR.length; i++) {
  
      if (calendarTR[i].children[5]) {
        calendarTR[i].children[5].style.color = '#fe3365';
      }

      if (calendarTR[i].children[6]) {
        calendarTR[i].children[6].style.color = '#fe3365';
      }
    }

    for(let i = 0; i < calendarDaysList.length; i++) {

      if (calendarDaysList[i].innerHTML == new Date().getDate() && new Date().getMonth() === Calendar.getYearAndMonth().month && new Date().getFullYear() === Calendar.getYearAndMonth().year) {
        calendarDaysList[i].style.backgroundColor = '#fe3365';
        calendarDaysList[i].style.color = '#ffff';
      }

      if (calendarDaysList[i].innerHTML === '') {
        calendarDaysList[i].style.cursor = 'auto';
      }

      calendarDaysList[i].onclick = () => {

        if (calendarDaysList[i].innerHTML === '') {
          return false;
        } else if (calendarDaysList[i] !== '') {
          document.getElementById('date-input').value = new DateFormat().getDateFormat(calendarDaysList[i].innerHTML, Calendar.getYearAndMonth().month + 1, Calendar.getYearAndMonth().year);
          document.querySelector('.date-block').removeChild(document.querySelector('.calendar'));
        }
      };
    }
  }

  static getDay(year, month) {
    let day = new Date(year, month, 1).getDay();

    if (day === 0) {
      day = 7;
    }

    return day - 1;
  }
}


class DateFormat {
  constructor() {
    this.date = new Date().getDate() + '';
    this.month = (new Date().getMonth() + 1) + '';
    this.year = new Date().getFullYear() + '';
    this.hours = new Date().getHours() + '';
    this.minutes = new Date().getMinutes() + '';
  }

  //Отображение датых в формате "чч.мм.гггг"
  getDateFormat(date, month, year) {
    date +='';
    month +=''; 

    if (date.length === 1) {
      date = `0${date}`;
    }

    if (month.length === 1) {
      month = `0${month}`;
    }

    return `${date}.${month}.${year}`;
  }
}

let init = () => {
  
  for(let i = 0; i < data.length; i++) {
    new Specialist(data[i].image, data[i].name, data[i].surname, data[i].date, Specialist.getAge(data[i].date), data[i].position, data[i].remoteWork, data[i].city, data[i].street, data[i].house, data[i].room).create();
  }

  document.onclick = (event) => {
    let target = event.target;

    //поиск по фамилии
    if (target.classList.contains('search-row-info')) {
      let inputSearch = document.querySelector('.search');

      if (inputSearch.value !== '') {
        let checkList = Form.checkForm({
          elem: inputSearch,
          pattern: '^[а-яА-ЯёЁa-zA-Z]+$'
        });

        if (checkList.length === 0) {
          Specialist.search(inputSearch.value);
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    //Очистить поиск 
    if (target.classList.contains('search-reset')) {
      Specialist.searchReset();
    }

    //Добавление записи
    if (target.classList.contains('add-row-info')) {
      let cover = document.querySelector('.cover');
      cover.classList.add('cover-active');

      //Сохоранение и проверка данных формы
      let saveBtn = document.querySelector('.save-btn');
      saveBtn.onclick = () => {
        let specialistForm = document.forms.specialist;
      
        let inputData = {
          image: 'img/avatar.jpg',
          name: specialistForm.name.value,
          surname: specialistForm.surname.value,
          date: specialistForm.date.value,
          position: specialistForm.position.value,
          remoteWork: specialistForm.remoteWork.checked,
          city: specialistForm.city.value,
          street: specialistForm.street.value,
          house: specialistForm.house.value,
          room: specialistForm.room.value
        };

        let checkList = Form.checkForm({
            elem: specialistForm.name,
            pattern: '^[а-яА-ЯёЁa-zA-Z]+$'
          },
          {
            elem: specialistForm.surname,
            pattern: '^[а-яА-ЯёЁa-zA-Z]+$'
          },
          {
            elem: specialistForm.position,
            pattern: '^[а-яА-ЯёЁa-zA-Z]+$'
          },
          {
            elem: specialistForm.date,
            pattern: '^([0-9]{2}).([0-9]{2}).([0-9]{4})$'
          },
          {
            elem: specialistForm.city,
            pattern: '^[а-яА-ЯёЁa-zA-Z.:_-]+$'
          },
          {
            elem: specialistForm.street,
            pattern: '^[а-яА-ЯёЁa-zA-Z0-9.:_-]+$'
          },
          {
            elem: specialistForm.house,
            pattern: '^[а-яА-ЯёЁa-zA-Z0-9.:_-]+$'
          },
          {
            elem: specialistForm.room,
            pattern: '^[а-яА-ЯёЁa-zA-Z0-9.:_-]+$'
          }
        );

        if (checkList.length === 0) {
          new Specialist(inputData.image, inputData.name, inputData.surname, inputData.date, Specialist.getAge(inputData.date) , inputData.position, inputData.remoteWork, inputData.city , inputData.street, inputData.house, inputData.room).create();
          specialistForm.reset();
          cover.classList.remove('cover-active');
        } else {
          return false;
        }
      };
    }

    //Выбор профессии
    if (target.classList.contains('position-select-btn')) {
      let selectPositionBlock = document.querySelector('.select-position');
      let positionInput = document.getElementById('position-input');
      let selectList = document.querySelectorAll('.select-position li');

      if (!selectPositionBlock.classList.contains('select-position-active')) {
        target.classList.remove('lnr-chevron-down');
        target.classList.add('lnr-chevron-left');
        selectPositionBlock.classList.add('select-position-active');

        for(let i = 0; i < selectList.length; i++) {
          selectList[i].onclick = (event) => {
            positionInput.value = event.target.innerHTML;
            selectPositionBlock.classList.remove('select-position-active');
            target.classList.remove('lnr-chevron-left');
            target.classList.add('lnr-chevron-down');
          };
        }

      } else {
        selectPositionBlock.classList.remove('select-position-active');
        target.classList.remove('lnr-chevron-left');
        target.classList.add('lnr-chevron-down');
      }
    }

    //Выбор даты рождения
    if (target.classList.contains('date-select-btn')) {
      
      if (!document.querySelector('.date-block').contains(document.querySelector('.calendar'))) {
        let calendar = new Calendar().createCalendar();
      } else {
        document.querySelector('.date-block').removeChild(document.querySelector('.calendar'));
      }
    }

    //Выход из формы без сохранения
    if (target.classList.contains('exit-btn')) {
      let cover = document.querySelector('.cover');
      cover.classList.remove('cover-active');
      for(let i = 0; i < document.forms.specialist.elements.length; i++) {
        document.forms.specialist.elements[i].style.borderColor = '';
        document.forms.specialist.elements[i].style.color = '';
      }
    }

    //Очистка данных формы
    if (target.classList.contains('reset-btn')) {
      for(let i = 0; i < document.forms.specialist.elements.length; i++) {
        document.forms.specialist.elements[i].style.borderColor = '';
        document.forms.specialist.elements[i].style.color = '';
      }
    }

    //Сортировка столбца по имени
    if (target.classList.contains('sort-name')) {
    
      target.classList.toggle('sort-normal');

      if (target.classList.contains('sort-normal')) {
        target.classList.remove('lnr-chevron-up');
        target.classList.add('lnr-chevron-down');
        Specialist.sort({
          type: 'string',
          typeSort: 'normal',
          index: 1
        });
        Specialist.setBackground();
      } else {
        target.classList.remove('lnr-chevron-down');
        target.classList.add('lnr-chevron-up');
        Specialist.sort({
          type: 'string',
          typeSort: 'reverse',
          index: 1,
        });
        Specialist.setBackground();
      }
    }

    //Сортировка столбца по фамилии
    if (target.classList.contains('sort-surname')) {
      
      target.classList.toggle('sort-normal');

      if (target.classList.contains('sort-normal')) {
        target.classList.remove('lnr-chevron-up');
        target.classList.add('lnr-chevron-down');
        Specialist.sort({
          type: 'string',
          typeSort: 'normal',
          index: 2
        });
        Specialist.setBackground();
      } else {
        target.classList.remove('lnr-chevron-down');
        target.classList.add('lnr-chevron-up');
        Specialist.sort({
          type: 'string',
          typeSort: 'reverse',
          index: 2
        });
        Specialist.setBackground();
      }
    }

    //Сортировка столбца по возрасту
    if (target.classList.contains('sort-age')) {
      
      target.classList.toggle('sort-normal');

      if (target.classList.contains('sort-normal')) {
        target.classList.remove('lnr-chevron-up');
        target.classList.add('lnr-chevron-down');
        Specialist.sort({
          type: 'number',
          typeSort: 'normal',
          index: 4
        });
        Specialist.setBackground();
      } else {
        target.classList.remove('lnr-chevron-down');
        target.classList.add('lnr-chevron-up');
        Specialist.sort({
          type: 'number',
          typeSort: 'reverse',
          index: 4
        });
        Specialist.setBackground();
      }
    }

    //Сортировка столбца по профессии
    if (target.classList.contains('sort-position')) {
      
      target.classList.toggle('sort-normal');

      if (target.classList.contains('sort-normal')) {
        target.classList.remove('lnr-chevron-up');
        target.classList.add('lnr-chevron-down');
        Specialist.sort({
          type: 'string',
          typeSort: 'normal',
          index: 5
        });
        Specialist.setBackground();
      } else {
        target.classList.remove('lnr-chevron-down');
        target.classList.add('lnr-chevron-up');
        Specialist.sort({
          type: 'string',
          typeSort: 'reverse',
          index: 5
        });
        Specialist.setBackground();
      }
    }

    //Сортировка столбца по возможности удаленной работы
    if (target.classList.contains('sort-remote-work')) {
      
      target.classList.toggle('sort-normal');

      if (target.classList.contains('sort-normal')) {
        target.classList.remove('lnr-chevron-up');
        target.classList.add('lnr-chevron-down');
        Specialist.sort({
          type: 'boolean',
          typeSort: 'normal',
          index: 6
        });
        Specialist.setBackground();
      } else {
        target.classList.remove('lnr-chevron-down');
        target.classList.add('lnr-chevron-up');
        Specialist.sort({
          type: 'boolean',
          typeSort: 'reverse',
          index: 6
        });
        Specialist.setBackground();
      }
    }
  };

  //Изменение ширины столбца
  let resizeBtn = document.querySelectorAll('.resize-btn');

  for(let i = 0; i < resizeBtn.length; i++) {
    resizeBtn[i].onmousedown = (event) => {
      
      document.onmousemove = (event) => {
        resizeBtn[i].parentElement.style.width = (event.pageX - resizeBtn[i].parentElement.getBoundingClientRect().left) + 'px';
      };
      document.onmouseup = function() {
        document.onmousemove = document.onmouseup = null;
      };

      return false;
    };
  }
};

window.onload = init;
