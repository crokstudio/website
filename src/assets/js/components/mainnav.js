const nav = document.querySelector(".mainnav--container");

if (nav) {
  const cssScrollHiddenClass = "-anim__scrollHidden";
  const jsScrollHiddenClass = "-anim__scrollHidden-js";
  let lastScrollY = window.scrollY;
  let navScrollDirection = -1;
  let navScrollTicking = false;

  const setNavScrollDirection = (direction) => {
    if (navScrollDirection === direction) {
      return;
    }

    navScrollDirection = direction;
    nav.style.setProperty("--js-scroll-direction", String(direction));
  };

  const updateNavVisibility = () => {
    navScrollTicking = false;

    const currentScrollY = window.scrollY;

    if (window.location.hash === "#mainnav" || currentScrollY <= 0) {
      setNavScrollDirection(-1);
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY) {
      setNavScrollDirection(1);
    } else if (currentScrollY < lastScrollY) {
      setNavScrollDirection(-1);
    }

    lastScrollY = currentScrollY;
  };

  const requestNavVisibilityUpdate = () => {
    if (navScrollTicking) {
      return;
    }

    navScrollTicking = true;
    window.requestAnimationFrame(updateNavVisibility);
  };

  if (nav.classList.contains(cssScrollHiddenClass)) {
    nav.classList.remove(cssScrollHiddenClass);
    nav.classList.add(jsScrollHiddenClass);
    nav.style.setProperty("--js-scroll-direction", String(navScrollDirection));

    window.addEventListener("scroll", requestNavVisibilityUpdate, { passive: true });
    window.addEventListener("resize", requestNavVisibilityUpdate);
    window.addEventListener("hashchange", requestNavVisibilityUpdate);

    requestNavVisibilityUpdate();
  }

  const normalizePath = (pathname) => {
    const trimmedPath = pathname.replace(/index\.html$/, "").replace(/\/+$/, "");
    return trimmedPath === "" ? "/" : trimmedPath;
  };

  const currentPath = normalizePath(window.location.pathname);
  const navItems = Array.from(nav.querySelectorAll(".mainnav--item"));

  const sectionLinks = navItems
    .map((item) => {
      const link = item.querySelector("a");

      if (!link) {
        return null;
      }

      const url = new URL(link.href, window.location.origin);
      const targetId = url.hash.replace("#", "");

      if (!targetId || normalizePath(url.pathname) !== currentPath) {
        return null;
      }

      const section = document.getElementById(targetId);

      if (!section) {
        return null;
      }

      return { item, section };
    })
    .filter(Boolean);

  if (sectionLinks.length) {
    let activeId = null;
    let ticking = false;

    const setActiveItem = (nextActiveId) => {
      if (!nextActiveId || nextActiveId === activeId) {
        return;
      }

      activeId = nextActiveId;

      sectionLinks.forEach(({ item, section }) => {
        const isActive = section.id === nextActiveId;
        item.classList.toggle("mainnav--item-active", isActive);
      });
    };

    const getActiveSection = () => {
      const triggerLine = window.innerHeight * 0.35;
      let fallbackSection = sectionLinks[0].section;

      for (const { section } of sectionLinks) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= triggerLine) {
          fallbackSection = section;
        }

        if (rect.top <= triggerLine && rect.bottom > triggerLine) {
          return section;
        }
      }

      return fallbackSection;
    };

    const updateActiveSection = () => {
      ticking = false;
      setActiveItem(getActiveSection().id);
    };

    const requestUpdate = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    requestUpdate();
  }
}
