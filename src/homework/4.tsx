import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
} from "react";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type SelectedMenu = { id: MenuIds } | {};
type MenuSelected = {
  selectedMenu: SelectedMenu;
};
type MenuAction = {
  onSelectedMenu: (menu: SelectedMenu) => void;
};

const MenuSelectedContext = createContext<MenuSelected | undefined>(undefined);
const MenuActionContext = createContext<MenuAction | undefined>(undefined);

type PropsProvider = {
  children: ReactNode;
};

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({});

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );
  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[];
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext)!;
  const selectedMenu = useContext(MenuSelectedContext)!;

  return (
    <>
      {menus.map((menu) => (
        <div
          key={menu.id}
          onClick={() => onSelectedMenu({ selectedMenu: menu })}
        >
          {menu.title}{" "}
          {selectedMenu?.selectedMenu.id === menu.id
            ? "Selected"
            : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
