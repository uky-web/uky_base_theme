const setUpHeader = () => {
  /*
   *   This content is licensed according to the W3C Software License at
   *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
   *
   *   Supplemental JS for the disclosure menu keyboard behavior
   */
  const DisclosureNav = function (domNode) {
    this.rootNode = domNode;
    this.triggerNodes = [];
    this.controlledNodes = [];
    this.openIndex = null;
    this.useArrowKeys = true;
  };

  DisclosureNav.prototype.init = function () {
    const buttons = this.rootNode.querySelectorAll(".main-nav-dropdown-button");
    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons[i];
      // set selector to the element that contains the content panel
      const menu = button.parentNode.querySelector("section");
      this.triggerNodes.push(button);
      if (menu) {
        // save ref to button and controlled menu
        this.controlledNodes.push(menu);
        // collapse menus
        button.setAttribute("aria-expanded", "false");
        // attach event listeners
        menu.addEventListener("keydown", this.handleMenuKeyDown.bind(this));
      }
      button.addEventListener("click", this.handleButtonClick.bind(this));
      button.addEventListener("keydown", this.handleButtonKeyDown.bind(this));
    }

    const panelButtons = this.rootNode.querySelectorAll(
      ".sub-nav-panel-button",
    );
    for (let i = 0; i < panelButtons.length; i += 1) {
      const button = panelButtons[i];
      // set selector to the element that contains the content panel
      const menu = button.parentNode.querySelector("section");
      this.triggerNodes.push(button);
      if (menu) {
        // save ref to button and controlled menu
        this.controlledNodes.push(menu);
        // collapse menus
        button.setAttribute("aria-expanded", "false");
        // attach event listeners
        menu.addEventListener("keydown", this.handleMenuKeyDown.bind(this));
      }
      button.addEventListener("click", this.handleButtonClick.bind(this));
      button.addEventListener("keydown", this.handleButtonKeyDown.bind(this));
    }

    const backButtons = this.rootNode.querySelectorAll("a.close-panel");
    for (let i = 0; i < backButtons.length; i += 1) {
      const backButton = backButtons[i];
      backButton.addEventListener("click", this.handleBackButton.bind(this));
    }

    /* Close content panel if focus moves from a link */
    this.rootNode.addEventListener("focusout", this.handleBlur.bind(this));
  };

  DisclosureNav.prototype.toggleExpand = function (index, expanded) {
    // close open menu, if applicable
    if (this.triggerNodes[index]) {
      if (this.triggerNodes[index].className !== "sub-nav-panel-button") {
        if (this.openIndex !== index) {
          this.toggleExpand(this.openIndex, false);
        }
      }
    } else {
      if (this.openIndex !== index) {
        this.toggleExpand(this.openIndex, false);
      }
    }

    // handle menu at called index
    if (this.triggerNodes[index]) {
      this.openIndex = expanded ? index : null;
      this.triggerNodes[index].setAttribute("aria-expanded", expanded);
    }
  };

  DisclosureNav.prototype.controlFocusByKey = function (
    keyboardEvent,
    nodeList,
    currentIndex,
  ) {
    switch (keyboardEvent.key) {
      case "ArrowUp":
      case "ArrowLeft":
        keyboardEvent.preventDefault();
        if (currentIndex > -1) {
          const prevIndex = Math.max(0, currentIndex - 1);
          nodeList[prevIndex].focus();
        }
        break;
      case "ArrowDown":
      case "ArrowRight":
        keyboardEvent.preventDefault();
        if (currentIndex > -1) {
          const nextIndex = Math.min(nodeList.length - 1, currentIndex + 1);
          nodeList[nextIndex].focus();
        }

        break;
      case "Home":
        keyboardEvent.preventDefault();
        nodeList[0].focus();
        break;
      case "End":
        keyboardEvent.preventDefault();
        nodeList[nodeList.length - 1].focus();
        break;
      default:
      // do nothing
    }
  };

  /* Event Handlers */
  DisclosureNav.prototype.handleBlur = function (event) {
    const menuContainsFocus = this.rootNode.contains(event.relatedTarget);
    if (!menuContainsFocus && this.openIndex !== null) {
      this.toggleExpand(this.openIndex, false);
    }
  };

  DisclosureNav.prototype.handleButtonKeyDown = function (event) {
    const targetButtonIndex = this.triggerNodes.indexOf(document.activeElement);

    // close on escape
    if (event.key === "Escape") {
      this.toggleExpand(this.openIndex, false);
    }

    // move focus into the open menu if the current menu is open
    else if (
      this.useArrowKeys &&
      this.openIndex === targetButtonIndex &&
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      this.controlledNodes[this.openIndex].querySelector("a").focus();
    }

    // handle arrow key navigation between top-level buttons, if set
    else if (this.useArrowKeys) {
      this.controlFocusByKey(event, this.triggerNodes, targetButtonIndex);
    }
  };

  DisclosureNav.prototype.handleButtonClick = function (event) {
    const button = event.target;
    const buttonIndex = this.triggerNodes.indexOf(button);
    const buttonExpanded = button.getAttribute("aria-expanded") === "true";
    this.toggleExpand(buttonIndex, !buttonExpanded);
  };

  DisclosureNav.prototype.handleBackButton = function (event) {
    const panelControl = event.target.parentNode.previousElementSibling;
    panelControl.setAttribute("aria-expanded", "false");
  };

  DisclosureNav.prototype.handleMenuKeyDown = function (event) {
    if (this.openIndex === null) {
      return;
    }

    const menuLinks = Array.prototype.slice.call(
      this.controlledNodes[this.openIndex].querySelectorAll("a"),
    );
    const currentIndex = menuLinks.indexOf(document.activeElement);

    // close on escape
    if (event.key === "Escape") {
      this.triggerNodes[this.openIndex].focus();
      this.toggleExpand(this.openIndex, false);
    }

    // handle arrow key navigation within menu links, if set
    else if (this.useArrowKeys) {
      this.controlFocusByKey(event, menuLinks, currentIndex);
    }
  };

  // switch on/off arrow key navigation
  DisclosureNav.prototype.updateKeyControls = function (useArrowKeys) {
    this.useArrowKeys = useArrowKeys;
  };

  /* Initialize Disclosure Menus */
  window.addEventListener(
    "load",
    function (event) {
      const menus = document.querySelectorAll(".menu-level-0");
      const disclosureMenus = [];

      for (let i = 0; i < menus.length; i += 1) {
        disclosureMenus[i] = new DisclosureNav(menus[i]);
        disclosureMenus[i].init();
      }

      return event;
    },
    false,
  );
  // Set a negative left margin on the content panel background
  // Match the size to the left margin of the slab__wrapper element
  function setLeftMargin() {
    let marginLeft = $("#MainHeader .slab__wrapper").css("margin-left");
    marginLeft = parseFloat(marginLeft, 10);
    if (marginLeft < 25) {
      marginLeft = marginLeft + 16;
    }
    const newLeft = "-" + marginLeft + "px";
    const windowWidth = $("#MainHeader").css("width");
    $(".panel-bg").css({ left: newLeft, width: windowWidth });
  }
  // Set the margin when the header is laoded
  setLeftMargin();
  // Reset the margin when the viewport is resized
  window.addEventListener("resize", setLeftMargin);
};

if (!window.STORYBOOK_ENV) setUpHeader();

/* Export the script for use in Storybook */
// export default setUpHeader;

/* Javascript to put items into 2 columns by splitting the total number of items in half */
document.addEventListener("DOMContentLoaded", function () {
  var listContainers = document.querySelectorAll(".link-list ul");

  listContainers.forEach(function (listContainer) {
    var listItems = Array.from(listContainer.children);
    var halfLength = Math.ceil(listItems.length / 2);

    var column1 = document.createElement("ul");
    column1.id = "uky-mega-menu-column1";
    listContainer.parentNode.insertBefore(column1, listContainer);

    var column2 = document.createElement("ul");
    column2.id = "uky-mega-menu-column2";
    listContainer.parentNode.insertBefore(column2, listContainer.nextSibling);

    listItems.forEach(function (item, index) {
      if (index < halfLength) {
        column1.appendChild(item);
      } else {
        column2.appendChild(item);
      }
    });

    // Remove the original list container
    listContainer.parentNode.removeChild(listContainer);
  });
});
