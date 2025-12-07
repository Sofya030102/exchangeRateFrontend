
import React, { useState, useContext } from 'react';
import { Modal, Form, Input, Button, Tabs, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';

const { Title } = Typography;

const AuthModal = () => {
    const { isModalOpen, closeAuthModal, login, register } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleCancel = () => {
        closeAuthModal();
        form.resetFields();
        setActiveTab('login');
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (activeTab === 'login') {
                await login(values.email, values.password);
                message.success('Рады видеть вас снова!');
                form.resetFields();
            } else {
                await register(values.email, values.password);
                message.success('Регистрация успешна! Теперь войдите.');
                setActiveTab('login');
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={400}
            centered
            destroyOnClose
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💱</div>
                <Title level={4}>CurrencyMaster</Title>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                centered
                items={[
                    { key: 'login', label: 'Вход' },
                    { key: 'register', label: 'Регистрация' }
                ]}
            />

            <Form
                form={form}
                name="auth_modal_form"
                onFinish={onFinish}
                layout="vertical"
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Введите Email' },
                        { type: 'email', message: 'Некорректный формат Email' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Email"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Введите пароль' },
                        { min: 6, message: 'Минимум 6 символов' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Пароль"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        loading={loading}
                        style={{ marginBottom: 10 }}
                    >
                        {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>

                    {activeTab === 'login' && (
                        <div style={{ textAlign: 'center' }}>
                            <Button type="link" size="small">Забыли пароль?</Button>
                        </div>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AuthModal;