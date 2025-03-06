import React, {useEffect, useState, lazy, Suspense} from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    List,
    message,
    Modal,
    notification,
    Popconfirm,
    Progress,
    Select,
    Space,
    Table,
    Tooltip,
    Typography
} from "antd";
import { Scrollbars } from 'react-custom-scrollbars';
// import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';

import './commandBar.css';

function CommandBar(props) {
    // const [api, contextHolder] = notification.useNotification();
    const [messageApi, contextHolder] = message.useMessage();

    // 状态管理：工具选择和命令输入
    let [command, setCommand] = useState('');
    const [cmds, setCmds] = useState({
        "option1": [{"label":"label1", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}],
        "option2": [{"label":"label2", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}],
        "option3": [{"label":"label3", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}],
        "option4": [{"label":"label4", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}, {"label":"label", "str":"cmd"}]
    });

    useEffect(() => {

    });

    // cmd bar选项（你可以根据需要扩展）
    const [option, setOption] = useState("");
    const handleOptionChange = (value) => {
        setOption(value);
        setAddButtonVisible(false);
        setEditButtonBarVisible(false);
        setDelButtonBarVisible(false);
    };
    // 处理命令输入变化
    const handleCommandChange = (event) => {
        setCommand(event.target.value);
    };

    // 处理发送命令（这里可以添加实际的发送逻辑）
    const handleSendCommand = () => {
        if (command.trim()) {
            console.log(`Sending command: ${command} with tool`);
            // 这里可以添加实际的 API 调用或逻辑来发送命令
            props.send(command + "\n");
            setCommand(''); // 清空输入框
        }
    };

    // 按 Enter 键发送命令
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // 在这里添加你的逻辑，比如发送命令或处理输入 Shift + Enter 被按下！
                return
            } else {
                // 阻止默认行为（如换行）
                event.preventDefault();

                const command = event.target.value;
                console.log("当前命令:", command);
                handleSendCommand();
            }
        }
    };

    // 获取当前选中的选项对应的命令列表
    const getCommandsForOption = () => {
        console.log("mark", option, cmds[option])
        return cmds[option] || []; // 如果选择的工具不在 cmds 中，返回空数组
    };

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuType, setMenuType] = useState('default');
    // 定义不同类型的菜单项
    const menuOptions = {
        select: [
            { id: 1, label: '添加Button' },
            { id: 2, label: '添加Button Bar'},
            { id: 3, label: '编辑Button Bar'},
            { id: 4, label: '删除Button Bar'}
        ],
        button: [
            { id: 1, label: '编辑Button' },
            { id: 2, label: '删除Button' }
        ],
    };
    const handleContextMenu = (e, itemId, type) => {
        console.log(`右键点击了 ${type} ${itemId}`)
        e.preventDefault();
        e.stopPropagation(); // 阻止事件冒泡到父级

        // 边界检测
        const menuHeight = 150;
        const menuWidth = 170;
        let x = e.pageX;
        let y = e.pageY;

        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth;
        }
        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight;
        }

        setMenuPosition({ x, y });
        setSelectedItem(itemId);
        setMenuType(type);
        setMenuVisible(true);
    };

    useEffect(() => {
        const handleClick = () => setMenuVisible(false);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleMenuItemClick = (item) => {
        console.log(`点击了 ${item.label} 于控件 ${selectedItem} (类型: ${menuType})`);
        setMenuVisible(false);

        if (menuType === 'select') {
            if (item.id === 1) {
                setAddButtonVisible(true);
            } else if (item.id === 2) {
                setAddButtonBarVisible(true);
            } else if (item.id === 3) {
                setLabelBar1(option)
                setEditButtonBarVisible(true);
            } else if (item.id === 4) {
                setDelButtonBarVisible(true);
            }
        } else if (menuType === 'button') {
            if (item.id === 1) {
                setEditButtonVisible(true);
                setLabel1(selectedItem["label"]);
                setSendStr1(selectedItem["str"]);
            } else if (item.id === 2) {
                setDelButtonVisible(true);
            }
        }
    };

    const [addButtonVisible, setAddButtonVisible] = useState(false);
    const [editButtonVisible, setEditButtonVisible] = useState(false);
    const [delButtonVisible, setDelButtonVisible] = useState(false);
    const [addButtonBarVisible, setAddButtonBarVisible] = useState(false);
    const [editButtonBarVisible, setEditButtonBarVisible] = useState(false);
    const [delButtonBarVisible, setDelButtonBarVisible] = useState(false);

    const [label, setLabel] = useState('');
    const [sendStr, setSendStr] = useState('');
    const handleAddButtonOk = () => {
        setAddButtonVisible(false);
        if (label.trim()) {
            // 同步更新 cmds

            const newCmds = {...cmds};
            newCmds[option] = [...(newCmds[option] || []), {label: label, str: sendStr}];
            setCmds(newCmds);
        } else {
            messageApi.error('Label 不能为空！')
        }
    }
    const handleAddButtonCancel = () => {
        setAddButtonVisible(false);
        setLabel('');
        setSendStr('');
    }
    const [label1, setLabel1] = useState('');
    const [sendStr1, setSendStr1] = useState('');
    const handleEditButtonOk = () => {
        setEditButtonVisible(false);
        if (label1.trim()) {
            // 同步更新 cmds
            // if (selectedItem)
            const newCmds = {...cmds};
            newCmds[option] = [...(newCmds[option] || []), {label: label1, str: sendStr1}];
            setCmds(newCmds);
        } else {
            messageApi.error('Label 不能为空！')
        }
    }
    const handleEditButtonCancel = () => {
        setEditButtonVisible(false);
        setLabel1('');
        setSendStr1('');
    }
    const handleDelButtonOk = () => {
        setDelButtonVisible(false);
    }
    const handleDelButtonCancel = () => {
        setDelButtonVisible(false);
    }
    const [labelBar, setLabelBar] = useState('');
    const handleAddButtonBarOk = () => {
        setAddButtonBarVisible(false);
        if (labelBar.trim()) {
            const newCmds = {...cmds};
            newCmds[labelBar] = [];
            setCmds(newCmds);
        } else {
            messageApi.error('Label 不能为空！')
        }
    }
    const handleAddButtonBarCancel = () => {
        setAddButtonBarVisible(false);
        setLabelBar('');
    }
    const [labelBar1, setLabelBar1] = useState('');
    const handleEditButtonBarOk = () => {
        setEditButtonBarVisible(false);
        if (labelBar1.trim()) {
            const newCmds = {...cmds};
            newCmds[labelBar] = [];
            setCmds(newCmds);
        } else {
            messageApi.error('Label 不能为空！')
        }
    }
    const handleEditButtonBarCancel = () => {
        setEditButtonBarVisible(false);
        setLabelBar1('');
    }

    const onButtonClick = (cmd) => {
        setCommand(command + cmd["str"]);
    }

    const handleDelButtonBarOk = () => {
        setDelButtonBarVisible(false);
    }
    const handleDelButtonBarCancel = () => {
        setDelButtonBarVisible(false);
    }

    return (
        <>
            <div className="command-input-container">
                <div
                    className="command-input-header"
                    onContextMenu={(e) => handleContextMenu(e, '', 'select')}
                >
                    <Scrollbars style={{minHeight: "50px", maxHeight: "150px" }}>
                        <Space wrap style={{margin_left: "3px", margin_right: "3px"}}>
                            <Select wrap
                                    onChange={handleOptionChange}
                                    style={{
                                        width: "100px",
                                        margin: "5px"
                                    }}
                            >
                                {Object.keys(cmds).map((key, index) =>(
                                    <Select.Option key={key} value={key}>
                                        {key}
                                    </Select.Option>
                                ))}
                            </Select>
                            {getCommandsForOption().map((cmd) => (
                                <Button
                                    onContextMenu={(e) => handleContextMenu(e, cmd, 'button')}
                                    onClick={() => {onButtonClick(cmd)}}
                                    key={cmd["label"]}
                                    style={{
                                        width: "100px",
                                        border_radius: "5px"
                                    }}
                                >
                                    {cmd["label"]}
                                </Button>
                            ))}
                        </Space>
                    </Scrollbars>
                </div>


                <div className="command-input-body">
                    <textarea
                        value={command}
                        onChange={handleCommandChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Send commands to active session"
                        className="command-textarea"
                    />
                </div>
            </div>

            {/* 右键菜单 */}
            {menuVisible && (
                <div
                    className="context-menu"
                    style={{
                        top: menuPosition.y,
                        left: menuPosition.x,
                    }}
                >
                    {menuOptions[menuType].map((item) => (
                        <div
                            key={item.id}
                            className="menu-item"
                            onClick={() => handleMenuItemClick(item)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}

            {contextHolder}

            { /* 右键菜单样式 */}
            {option && (
                <Modal title="Add Button"  open={addButtonVisible} onOk={handleAddButtonOk} onCancel={handleAddButtonCancel}>
                    <Input addonBefore="Label" value={label} onChange={e => {setLabel(e.target.value)}}/>
                    <Input addonBefore="Send String" value={sendStr} onChange={e => {setSendStr(e.target.value)}}/>
                </Modal>
            )}
            <Modal title="Edit Button" open={editButtonVisible} onOk={handleEditButtonOk} onCancel={handleEditButtonCancel}>
                <Input addonBefore="Label" value={label1} onChange={e => {setLabel1(e.target.value)}}/>
                <Input addonBefore="Send String" value={sendStr1} onChange={e => {setSendStr1(e.target.value)}}/>
            </Modal>
            <Modal title="Delete Button" open={delButtonVisible} onOk={handleDelButtonOk} onCancel={handleDelButtonCancel}>
                <p>Are you sure to delete this?</p>
            </Modal>
            <Modal title="Add Button Bar" open={addButtonBarVisible} onOk={handleAddButtonBarOk} onCancel={handleAddButtonBarCancel}>
                <Input addonBefore="Label" value={labelBar} onChange={e => {setLabelBar(e.target.value)}}/>
            </Modal>
            {option && (
                <Modal title="Edit Button Bar" open={editButtonBarVisible} onOk={handleEditButtonBarOk} onCancel={handleEditButtonBarCancel}>
                    <Input addonBefore="Label" value={labelBar1} onChange={e => {setLabelBar1(e.target.value)}}/>
                </Modal>
            )}
            {option && (
                <Modal title="Delete Button Bar" open={delButtonBarVisible} onOk={handleDelButtonBarOk} onCancel={handleDelButtonBarCancel}>
                    <p>Are you sure to delete this?</p>
                </Modal>
            )}
        </>
    );
}

export default CommandBar;