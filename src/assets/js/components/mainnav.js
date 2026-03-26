const nav = document.querySelector(".mainnav--container");

if (nav) {
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
