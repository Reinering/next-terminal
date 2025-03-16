import React, {useEffect, useState, lazy, Suspense} from 'react';
import {
    Button,
    Checkbox,
    Divider,
    Drawer,
    Input,
    message,
    Modal,
    Tooltip,
    Select,
    Space,
    Flex,
    Typography
} from "antd";
const { TextArea } = Input;
import {useSearchParams} from "react-router-dom";
import userPrecmds from "../../api/user-precmds";
// import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import { Scrollbars } from 'react-custom-scrollbars';
import { SettingOutlined } from '@ant-design/icons';
import 'react-contexify/ReactContexify.css';
import './CommandBar.css';

function CommandBar(props) {
    // const [api, contextHolder] = notification.useNotification();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const assetId = searchParams.get('assetId');

    // 状态管理：工具选择和命令输入
    let [command, setCommand] = useState('');
    const [cmds, setCmds] = useState({})

    useEffect(() => {
        let isSync = localStorage.getItem("isSync");
        if (isSync === "0") {
            localStorage.removeItem("precmds");
            getPreCmds();
        } else {
            if (localStorage.getItem("precmds")) {
                setCmds(JSON.parse(localStorage.getItem("precmds")));
            } else {
                getPreCmds();
            }
        }
        localStorage.setItem("isSync", "1");

        sessionStorage.getItem("option") ? setOption(sessionStorage.getItem("option")) : setOption(Object.keys(cmds)[0]);
        sessionStorage.getItem("isSudo") ? setIsSudo(sessionStorage.getItem("isSudo")) : setIsSudo(false);
        sessionStorage.getItem("isSendNow") ? setSendNow(sessionStorage.getItem("isSendNow")) : setSendNow(false);

    }, [assetId]);

    const getPreCmds = () => {
        userPrecmds.getUserPreCmds().then((data) => {
            let tmp = {};
            for (let d in data) {
                let da = data[d]
                let group = data[d]["group"]
                if (da.hasOwnProperty("group")) {
                    if (!tmp.hasOwnProperty(group)) {
                        tmp[group] = [];
                    }
                    Reflect.deleteProperty(da,"group");
                    if (da.hasOwnProperty("label") && da.hasOwnProperty("text")) {
                        tmp[group].push(da);
                    }
                }
            }
            setCmds(tmp);
            localStorage.setItem("precmds", JSON.stringify(tmp));
        });
    }

    // cmd bar选项（你可以根据需要扩展）
    const [option, setOption] = useState("");
    const handleOptionChange = (value) => {
        setOption(value);
        sessionStorage.setItem("option", value);
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
            // 这里可以添加实际的 API 调用或逻辑来发送命令
            if (isSudo) {
                props.send("sudo " + command + "\n");
            } else {
                props.send(command + "\n");
            }
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
                // const command = event.target.value;
                handleSendCommand();
            }
        }
    };

    // 获取当前选中的选项对应的命令列表
    const getCommandsForOption = () => {
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
        // console.log(`右键点击了 ${type} ${itemId}`)
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
        // console.log(`点击了 ${item.label} 于控件 ${selectedItem} (类型: ${menuType})`);
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
                setSendStr1(selectedItem["text"]);
                setMarkStr1(selectedItem["mark"]);
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
    const [markStr, setMarkStr] = useState('');
    const handleAddButtonOk = () => {
        setAddButtonVisible(false);
        if (label.trim()) {
            userPrecmds.addPreCmd({group: option, label: label, text: sendStr, mark: markStr}).then((data) => {
                if (data) {
                    const newCmds = {...cmds};
                    if (!newCmds.hasOwnProperty(option)) {
                        newCmds[option] = [];
                    }
                    newCmds[option].push({group: option, label: label, text: sendStr, mark: markStr});
                    setCmds(newCmds);
                    localStorage.setItem("precmds", JSON.stringify(newCmds));
                    messageApi.success("添加成功！");
                } else {
                    messageApi.error("添加失败！");
                }
                setLabel('');
                setSendStr('');
                setMarkStr('');
            });
        } else {
            messageApi.error('Label 不能为空！')
        }
    }
    const handleAddButtonCancel = () => {
        setAddButtonVisible(false);
        setLabel('');
        setSendStr('');
        setMarkStr('');
    }
    const [label1, setLabel1] = useState('');
    const [sendStr1, setSendStr1] = useState('');
    const [markStr1, setMarkStr1] = useState('');
    const handleEditButtonOk = () => {
        setEditButtonVisible(false);
        if (label1.trim()) {
            userPrecmds.updatePreCmd(
                {old: {"group": option, label: selectedItem["label"], text: selectedItem["text"], mark: selectedItem["mark"]},
                new: {"group": option, label: label1, text: sendStr1, mark: markStr1}}).then((data) => {
                if (data) {
                    const newCmds = {...cmds};
                    newCmds[option] = newCmds[option].map((cmd) => {
                        if (cmd["label"] === selectedItem["label"]) {
                            cmd["label"] = label1;
                            cmd["text"] = sendStr1;
                            cmd["mark"] = markStr1;
                        }
                        return cmd;
                    });
                    setCmds(newCmds);
                    localStorage.setItem("precmds", JSON.stringify(newCmds));
                    messageApi.success("更新成功！");
                } else {
                    messageApi.error("更新失败！");
                }
            });
        } else {
            messageApi.error('Label 不能为空！')
        }
    }
    const handleEditButtonCancel = () => {
        setEditButtonVisible(false);
        setLabel1('');
        setSendStr1('');
        setMarkStr1('');
    }
    const handleDelButtonOk = () => {
        setDelButtonVisible(false);
        if (selectedItem) {
            userPrecmds.deletePreCmd({group: option, label: selectedItem["label"], text: selectedItem["text"]}).then((data) => {
                if (data) {
                    const newCmds = {...cmds};
                    newCmds[option] = newCmds[option].filter((cmd) => cmd["label"] !== selectedItem["label"]);
                    setCmds(newCmds);
                    localStorage.setItem("precmds", JSON.stringify(newCmds));
                    messageApi.success("删除成功！");
                } else {
                    messageApi.error("删除失败！");
                }
            });
        }
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
            setOption(labelBar);
            sessionStorage.setItem("option", labelBar);
            localStorage.setItem("precmds", JSON.stringify(newCmds));
            setLabelBar('');
            messageApi.success("添加成功！");
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
            userPrecmds.updatePreCmdGroup({old: option, new: labelBar1}).then((data) => {
                if (data) {
                    const newCmds = {...cmds};
                    newCmds[labelBar1] = newCmds[option];
                    Reflect.deleteProperty(newCmds, option);
                    setOption(labelBar1);
                    sessionStorage.setItem("option", labelBar1);
                    setCmds(newCmds);
                    localStorage.setItem("precmds", JSON.stringify(newCmds));
                    messageApi.success("更新成功！");
                } else {
                    messageApi.error("更新失败！");
                }
            });
        } else {
            messageApi.error('Label 不能为空！')
        }
    }
    const handleEditButtonBarCancel = () => {
        setEditButtonBarVisible(false);
        setLabelBar1('');
    }
    const handleDelButtonBarOk = () => {
        setDelButtonBarVisible(false);
        if (option) {
            userPrecmds.deletePreCmdGroup({"group": option}).then((data) => {
                if (data) {
                    const newCmds = {...cmds};
                    Reflect.deleteProperty(newCmds, option);
                    setCmds(newCmds);
                    localStorage.setItem("precmds", JSON.stringify(newCmds));
                    setOption(Object.keys(newCmds)[0]);
                    sessionStorage.setItem("option", Object.keys(newCmds)[0]);
                    messageApi.success("删除成功！");
                } else {
                    messageApi.error("删除失败！");
                }
            });
        }
    }
    const handleDelButtonBarCancel = () => {
        setDelButtonBarVisible(false);
    }

    const [isShowSettings, setIsShowSettings] = useState(false);
    const onSettingsOpen = () => {
        setIsShowSettings(true)
    }
    const onSettingsClose = () => {
        setIsShowSettings(false);
    }
    const [isSudo, setIsSudo] = useState(false);
    const onChangeSudo = (e) => {
        setIsSudo(e.target.checked);
        sessionStorage.setItem("isSudo", e.target.checked);
    }
    const [isSendNow, setSendNow] = useState(false);
    const onChangeSendNow = (e) => {
        setSendNow(e.target.checked);
        sessionStorage.setItem("isSendNow", e.target.checked);
    }

    const onButtonClick = (cmd) => {
        if (isSendNow) {
            if (isSudo) {
                props.send("sudo " + cmd["text"] + "\n");
            } else {
                props.send(cmd["text"] + "\n");
            }
        } else {
            setCommand(command + cmd["text"]);
        }
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
                            <Button type="primary" shape="circle" icon={<SettingOutlined />} onClick={onSettingsOpen}/>
                            <Select wrap
                                    value={option}
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
                                <Tooltip title={cmd["label"]}>
                                    <Button
                                        className="long-text-btn"
                                        onContextMenu={(e) => handleContextMenu(e, cmd, 'button')}
                                        onClick={() => {onButtonClick(cmd)}}
                                        key={cmd["label"]}
                                    >
                                        {cmd["label"]}
                                    </Button>
                                </Tooltip>
                            ))}
                        </Space>
                    </Scrollbars>
                </div>


                <div className="command-input-body">
                    <textarea
                        value={command}
                        onChange={handleCommandChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Send commands to active session, press Shift + Enter to line break."
                        className="command-textarea"
                    />
                </div>
            </div>

            <Drawer title="Settings" onClose={onSettingsClose} open={isShowSettings}>
                <Checkbox defaultChecked={isSudo} onChange={onChangeSudo}>sudo(enable)</Checkbox>
                <Checkbox defaultChecked={isSendNow} onChange={onChangeSendNow}>Send now</Checkbox>
                <Divider />
            </Drawer>

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
                    <Typography.Title level={5}>Label</Typography.Title>
                    <Input value={label} maxLength={16} onChange={e => {console.log("mark", e); setLabel(e.target.value)}}/>
                    <Typography.Title level={5}>Send String</Typography.Title>
                    <TextArea autoSize value={sendStr} onChange={e => {setSendStr(e.target.value)}}/>
                    <Typography.Title level={5}>Mark</Typography.Title>
                    <TextArea autoSize value={markStr} onChange={e => {setMarkStr(e.target.value)}}/>
                </Modal>
            )}
            <Modal title="Edit Button" open={editButtonVisible} onOk={handleEditButtonOk} onCancel={handleEditButtonCancel}>
                <Typography.Title level={5}>Label</Typography.Title>
                <Input value={label1} maxLength={16} onChange={e => {setLabel1(e.target.value)}}/>
                <Typography.Title level={5}>Send String</Typography.Title>
                <TextArea autoSize value={sendStr1} onChange={e => {setSendStr1(e.target.value)}}/>
                <Typography.Title level={5}>Mark</Typography.Title>
                <TextArea autoSize value={markStr1} onChange={e => {setMarkStr1(e.target.value)}}/>
            </Modal>
            <Modal title="Delete Button" open={delButtonVisible} onOk={handleDelButtonOk} onCancel={handleDelButtonCancel}>
                <p>Are you sure to delete this?</p>
            </Modal>
            <Modal title="Add Button Bar" open={addButtonBarVisible} onOk={handleAddButtonBarOk} onCancel={handleAddButtonBarCancel}>
                <Input addonBefore="Label" value={labelBar} maxLength={16} onChange={e => {setLabelBar(e.target.value)}}/>
            </Modal>
            {option && (
                <Modal title="Edit Button Bar" open={editButtonBarVisible} onOk={handleEditButtonBarOk} onCancel={handleEditButtonBarCancel}>
                    <Input addonBefore="Label" value={labelBar1} maxLength={16} onChange={e => {setLabelBar1(e.target.value)}}/>
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