(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class FullPage {
        constructor(element, options) {
            let config = {
                noEventSelector: "[data-no-event]",
                сlassInit: "fp-init",
                wrapperAnimatedClass: "fp-switching",
                selectorSection: "[data-fp-section]",
                activeClass: "active-section",
                previousClass: "previous-section",
                nextClass: "next-section",
                idActiveSection: 0,
                mode: element.dataset.fpEffect ? element.dataset.fpEffect : "slider",
                bullets: element.hasAttribute("data-fp-bullets") ? true : false,
                bulletsClass: "fp-bullets",
                bulletClass: "fp-bullet",
                bulletActiveClass: "fp-bullet-active",
                onInit: function() {},
                onSwitching: function() {},
                onDestroy: function() {}
            };
            this.options = Object.assign(config, options);
            this.wrapper = element;
            this.sections = this.wrapper.querySelectorAll(this.options.selectorSection);
            this.activeSection = false;
            this.activeSectionId = false;
            this.previousSection = false;
            this.previousSectionId = false;
            this.nextSection = false;
            this.nextSectionId = false;
            this.bulletsWrapper = false;
            this.stopEvent = false;
            if (this.sections.length) this.init();
        }
        init() {
            if (this.options.idActiveSection > this.sections.length - 1) return;
            this.setId();
            this.activeSectionId = this.options.idActiveSection;
            this.setEffectsClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) {
                this.setBullets();
                this.setActiveBullet(this.activeSectionId);
            }
            this.events();
            setTimeout((() => {
                document.documentElement.classList.add(this.options.сlassInit);
                this.options.onInit(this);
                document.dispatchEvent(new CustomEvent("fpinit", {
                    detail: {
                        fp: this
                    }
                }));
            }), 0);
        }
        destroy() {
            this.removeEvents();
            this.removeClasses();
            document.documentElement.classList.remove(this.options.сlassInit);
            this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            this.removeEffectsClasses();
            this.removeZIndex();
            this.removeStyle();
            this.removeId();
            this.options.onDestroy(this);
            document.dispatchEvent(new CustomEvent("fpdestroy", {
                detail: {
                    fp: this
                }
            }));
        }
        setId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.setAttribute("data-fp-id", index);
            }
        }
        removeId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.removeAttribute("data-fp-id");
            }
        }
        setClasses() {
            this.previousSectionId = this.activeSectionId - 1 >= 0 ? this.activeSectionId - 1 : false;
            this.nextSectionId = this.activeSectionId + 1 < this.sections.length ? this.activeSectionId + 1 : false;
            this.activeSection = this.sections[this.activeSectionId];
            this.activeSection.classList.add(this.options.activeClass);
            if (false !== this.previousSectionId) {
                this.previousSection = this.sections[this.previousSectionId];
                this.previousSection.classList.add(this.options.previousClass);
            } else this.previousSection = false;
            if (false !== this.nextSectionId) {
                this.nextSection = this.sections[this.nextSectionId];
                this.nextSection.classList.add(this.options.nextClass);
            } else this.nextSection = false;
        }
        removeEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.remove("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.remove("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.remove("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.add("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.add("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.add("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setStyle() {
            switch (this.options.mode) {
              case "slider":
                this.styleSlider();
                break;

              case "cards":
                this.styleCards();
                break;

              case "fade":
                this.styleFade();
                break;

              default:
                break;
            }
        }
        styleSlider() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)"; else if (index > this.activeSectionId) section.style.transform = "translate3D(0,100%,0)";
            }
        }
        styleCards() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index >= this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)";
            }
        }
        styleFade() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) {
                    section.style.opacity = "1";
                    section.style.visibility = "visible";
                } else {
                    section.style.opacity = "0";
                    section.style.visibility = "hidden";
                }
            }
        }
        removeStyle() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.opacity = "";
                section.style.visibility = "";
                section.style.transform = "";
            }
        }
        checkScroll(yCoord, element) {
            this.goScroll = false;
            if (!this.stopEvent && element) {
                this.goScroll = true;
                if (this.haveScroll(element)) {
                    this.goScroll = false;
                    const position = Math.round(element.scrollHeight - element.scrollTop);
                    if (Math.abs(position - element.scrollHeight) < 2 && yCoord <= 0 || Math.abs(position - element.clientHeight) < 2 && yCoord >= 0) this.goScroll = true;
                }
            }
        }
        haveScroll(element) {
            return element.scrollHeight !== window.innerHeight;
        }
        removeClasses() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.classList.remove(this.options.activeClass);
                section.classList.remove(this.options.previousClass);
                section.classList.remove(this.options.nextClass);
            }
        }
        events() {
            this.events = {
                wheel: this.wheel.bind(this),
                touchdown: this.touchDown.bind(this),
                touchup: this.touchUp.bind(this),
                touchmove: this.touchMove.bind(this),
                touchcancel: this.touchUp.bind(this),
                transitionEnd: this.transitionend.bind(this),
                click: this.clickBullets.bind(this)
            };
            if (isMobile.iOS()) document.addEventListener("touchmove", (e => {
                e.preventDefault();
            }));
            this.setEvents();
        }
        setEvents() {
            this.wrapper.addEventListener("wheel", this.events.wheel);
            this.wrapper.addEventListener("touchstart", this.events.touchdown);
            if (this.options.bullets && this.bulletsWrapper) this.bulletsWrapper.addEventListener("click", this.events.click);
        }
        removeEvents() {
            this.wrapper.removeEventListener("wheel", this.events.wheel);
            this.wrapper.removeEventListener("touchdown", this.events.touchdown);
            this.wrapper.removeEventListener("touchup", this.events.touchup);
            this.wrapper.removeEventListener("touchcancel", this.events.touchup);
            this.wrapper.removeEventListener("touchmove", this.events.touchmove);
            if (this.bulletsWrapper) this.bulletsWrapper.removeEventListener("click", this.events.click);
        }
        clickBullets(e) {
            const bullet = e.target.closest(`.${this.options.bulletClass}`);
            if (bullet) {
                const arrayChildren = Array.from(this.bulletsWrapper.children);
                const idClickBullet = arrayChildren.indexOf(bullet);
                this.switchingSection(idClickBullet);
            }
        }
        setActiveBullet(idButton) {
            if (!this.bulletsWrapper) return;
            const bullets = this.bulletsWrapper.children;
            for (let index = 0; index < bullets.length; index++) {
                const bullet = bullets[index];
                if (idButton === index) bullet.classList.add(this.options.bulletActiveClass); else bullet.classList.remove(this.options.bulletActiveClass);
            }
        }
        touchDown(e) {
            this._yP = e.changedTouches[0].pageY;
            this._eventElement = e.target.closest(`.${this.options.activeClass}`);
            if (this._eventElement) {
                this._eventElement.addEventListener("touchend", this.events.touchup);
                this._eventElement.addEventListener("touchcancel", this.events.touchup);
                this._eventElement.addEventListener("touchmove", this.events.touchmove);
                this.clickOrTouch = true;
                if (isMobile.iOS()) {
                    if (this._eventElement.scrollHeight !== this._eventElement.clientHeight) {
                        if (0 === this._eventElement.scrollTop) this._eventElement.scrollTop = 1;
                        if (this._eventElement.scrollTop === this._eventElement.scrollHeight - this._eventElement.clientHeight) this._eventElement.scrollTop = this._eventElement.scrollHeight - this._eventElement.clientHeight - 1;
                    }
                    this.allowUp = this._eventElement.scrollTop > 0;
                    this.allowDown = this._eventElement.scrollTop < this._eventElement.scrollHeight - this._eventElement.clientHeight;
                    this.lastY = e.changedTouches[0].pageY;
                }
            }
        }
        touchMove(e) {
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            if (isMobile.iOS()) {
                let up = e.changedTouches[0].pageY > this.lastY;
                let down = !up;
                this.lastY = e.changedTouches[0].pageY;
                if (targetElement) if (up && this.allowUp || down && this.allowDown) e.stopPropagation(); else if (e.cancelable) e.preventDefault();
            }
            if (!this.clickOrTouch || e.target.closest(this.options.noEventSelector)) return;
            let yCoord = this._yP - e.changedTouches[0].pageY;
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll && Math.abs(yCoord) > 20) this.choiceOfDirection(yCoord);
        }
        touchUp(e) {
            this._eventElement.removeEventListener("touchend", this.events.touchup);
            this._eventElement.removeEventListener("touchcancel", this.events.touchup);
            this._eventElement.removeEventListener("touchmove", this.events.touchmove);
            return this.clickOrTouch = false;
        }
        transitionend(e) {
            if (e.target.closest(this.options.selectorSection)) {
                this.stopEvent = false;
                this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            }
        }
        wheel(e) {
            if (e.target.closest(this.options.noEventSelector)) return;
            const yCoord = e.deltaY;
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll) this.choiceOfDirection(yCoord);
        }
        choiceOfDirection(direction) {
            this.stopEvent = true;
            if (0 === this.activeSectionId && direction < 0 || this.activeSectionId === this.sections.length - 1 && direction > 0) this.stopEvent = false;
            if (direction > 0 && false !== this.nextSection) this.activeSectionId = this.activeSectionId + 1 < this.sections.length ? ++this.activeSectionId : this.activeSectionId; else if (direction < 0 && false !== this.previousSection) this.activeSectionId = this.activeSectionId - 1 >= 0 ? --this.activeSectionId : this.activeSectionId;
            if (this.stopEvent) this.switchingSection();
        }
        switchingSection(idSection = this.activeSectionId) {
            this.activeSectionId = idSection;
            this.wrapper.classList.add(this.options.wrapperAnimatedClass);
            this.wrapper.addEventListener("transitionend", this.events.transitionEnd);
            this.removeClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) this.setActiveBullet(this.activeSectionId);
            this.options.onSwitching(this);
            document.dispatchEvent(new CustomEvent("fpswitching", {
                detail: {
                    fp: this
                }
            }));
        }
        setBullets() {
            this.bulletsWrapper = document.querySelector(`.${this.options.bulletsClass}`);
            if (!this.bulletsWrapper) {
                const bullets = document.createElement("div");
                bullets.classList.add(this.options.bulletsClass);
                this.wrapper.append(bullets);
                this.bulletsWrapper = bullets;
            }
            if (this.bulletsWrapper) for (let index = 0; index < this.sections.length; index++) {
                const span = document.createElement("span");
                span.classList.add(this.options.bulletClass);
                this.bulletsWrapper.append(span);
            }
        }
        setZIndex() {
            let zIndex = this.sections.length;
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = zIndex;
                --zIndex;
            }
        }
        removeZIndex() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = "";
            }
        }
    }
    if (document.querySelector("[data-fp]")) modules_flsModules.fullpage = new FullPage(document.querySelector("[data-fp]"), "");
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if ("click" === e.type) {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if ("watcherCallback" === e.type && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if ("navigator" === targetElement.dataset.watch) {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    const iconMenu = document.querySelector(".menu_icon");
    const menuBody = document.querySelector(".burger_menu");
    if (iconMenu) iconMenu.addEventListener("click", (function(e) {
        document.body.classList.toggle("_lock");
        iconMenu.classList.toggle("_active");
        menuBody.classList.toggle("_active");
    }));
    window["FLS"] = true;
    isWebp();
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
    pageNavigation();
})();