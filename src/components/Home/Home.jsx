import React, { useState, useEffect } from 'react';
import { fetchBooks, deleteBook } from '../../services/api';
import { Table, Button, Input, Row, Col, Modal } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, total: 0 });
    const [titleFilter, setTitleFilter] = useState('');
    const [sorter, setSorter] = useState({ field: '', order: '' });
    const navigate = useNavigate();

    const loadBooks = async (page = 1, title = '', sortField = '', sortOrder = '') => {
        setLoading(true);
        try {
            const data = await fetchBooks(page, title, sortField, sortOrder);
            setBooks(data?.data || []);
            setPagination({
                current: data.current_page,
                total: data.total,
                pageSize: data.per_page || 10,
            });
        } catch (error) {
            console.error('Failed to fetch books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks(pagination.current, titleFilter, sorter.field, sorter.order);
    }, [pagination.current, titleFilter, sorter]);

    const handleDelete = async (id) => {
        await deleteBook(id);
        loadBooks(pagination.current, titleFilter, sorter.field, sorter.order);
    };

    const handleShow = (id) => {
        navigate(`/books/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/update/${id}`);
    };

    const handleSearch = (e) => {
        setTitleFilter(e.target.value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this item?',
            content: 'Once deleted, this action cannot be undone.',
            onOk: () => handleDelete(id),
        });
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            render: (text) => text,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            render: (author) => author?.name || 'Unknown',
        },
        {
            title: 'Cover Image',
            dataIndex: 'cover_image',
            key: 'cover_image',
            render: (cover_image) => (
                <img src={cover_image} alt="Book Cover" width="80" height="50" />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleShow(record.id)}>Show</Button>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Edit</Button>
                    <Button type="link" danger onClick={() => confirmDelete(record.id)}>Delete</Button>
                </>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        const { field, order } = sorter;
        setSorter({
            field,
            order: order === 'ascend' ? 'asc' : 'desc',
        });
        setPagination({
            ...pagination,
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col xs={24} sm={16} md={18}>
                    <Input.Search
                        placeholder="Search books by title"
                        allowClear
                        enterButton
                        value={titleFilter}
                        onChange={handleSearch}
                        onSearch={(value) => {
                            setTitleFilter(value);
                            setPagination(prev => ({ ...prev, current: 1 }));
                        }}
                    />
                </Col>
                <Col xs={24} sm={8} md={6} style={{ textAlign: 'right', marginTop: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/create')}
                        style={{ marginRight: '10px' }}
                    >
                        Create Book
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => navigate('/author')}
                    >
                        Authors
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={books}
                loading={loading}
                rowKey="id"
                locale={{ emptyText: 'No books found.' }}
                pagination={{
                    current: pagination.current,
                    total: pagination.total,
                    pageSize: pagination.pageSize,
                    showSizeChanger: false,
                    onChange: (page) => setPagination(prev => ({ ...prev, current: page })),
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default Home;
