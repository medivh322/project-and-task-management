import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";

const SidebarMenu = () => {
    return (
        <Sider>
            <Menu
                mode="vertical"
                items={[
                    {
                        key: "2job2b21",
                        title: "Проекты",
                        label: <div>Проекты</div>,
                        children: [
                            {
                                key: "2job2fvszveaawb21",
                                title: "test222",
                                label: "Проект 1",
                                children: [
                                    {   
                                        popupOffset: [25,25],
                                        key: "242fgwettewt",
                                        title: "test222",
                                        label: <div>Проект 1</div>,
                                    }
                                ]
                            },
                            {
                                key: "2jo24444444444b2b21",
                                title: "test222",
                                label: <div>Проект 2</div>,
                                children: [
                                    {   
                                        popupOffset: [25,25],
                                        key: "twwwwwwwwwwsdf",
                                        title: "test222",
                                        label: <div>настройки</div>,
                                    },
                                    {   
                                        popupOffset: [25,25],
                                        key: "twwww231wwwwwwsdf",
                                        title: "test222",
                                        label: <div>удалить</div>,
                                    }
                                ]
                            },
                        ]
                    }
                ]}
            />
        </Sider>
    )
}

export default SidebarMenu;