import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Row, Col, Modal, notification } from 'antd';
import { fetchAuthors, deleteAuthor } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const Author = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ current: 1, total: 0, pageSize: 10 });
    const [nameFilter, setNameFilter] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        loadAuthors();
    }, [page, nameFilter]);

    const loadAuthors = async () => {
        setLoading(true);
        try {
            const response = await fetchAuthors(page, nameFilter);
            setAuthors(response.data);
            setPagination({
                current: response.current_page,
                total: response.total,
                pageSize: response.per_page,
            });
        } catch (err) {
            console.error('Error fetching authors:', err);
            notification.error({
                message: 'Error',
                description: 'Failed to load authors.',
            });
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = (value) => {
        setPage(1);
        setNameFilter(value);
    };

    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this author?',
            content: 'This action cannot be undone.',
            onOk: () => handleDelete(id),
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteAuthor(id);
            notification.success({ message: 'Author deleted successfully.' });
            loadAuthors();
        } catch (err) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete author.',
            });
        }
    };

    const handleEdit = (id) => {
        navigate(`/author/${id}`);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
                        Edit
                    </Button>
                    <Button type="link" icon={<DeleteOutlined />} danger onClick={() => confirmDelete(record.id)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Authors</h2>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col xs={24} sm={16} md={18}>
                    <Input.Search
                        placeholder="Search Author by name"
                        allowClear
                        enterButton
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        onSearch={handleSearch}
                    />
                </Col>
                <Col xs={24} sm={8} md={6} style={{ textAlign: 'right', marginTop: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/create-author')}
                        style={{ marginRight: '10px' }}
                    >
                        Create Author
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => navigate('/')}
                        style={{ marginRight: '10px' }}
                    >
                        Show Books
                    </Button>
                </Col>
            </Row>
            <Table
                dataSource={authors}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page) => setPage(page),
                }}
            />
        </div>
    );
};

export default Author;
