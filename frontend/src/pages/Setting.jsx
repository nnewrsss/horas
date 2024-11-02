import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import '../styles/setting.css';

function Settings() {
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
    });
    const [formData, setFormData] = useState(userData);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');

    // สถานะสำหรับตรวจสอบเบอร์มือถือ
    const [phoneError, setPhoneError] = useState('');

    // Address related states
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [tambons, setTambons] = useState([]);
    const [zipcodes, setZipcodes] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedAmphure, setSelectedAmphure] = useState('');
    const [selectedTambon, setSelectedTambon] = useState('');
    const [selectedZipcode, setSelectedZipcode] = useState('');

    // New state for House Number, Soi, and Road
    const [houseNumber, setHouseNumber] = useState('');
    const [soi, setSoi] = useState('');
    const [road, setRoad] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            navigate('/login'); // Redirect to login if not authenticated
        } else {
            fetchUserData();
            fetchProvinces();
        }
    }, [navigate]);

    // Fetch user data from backend
    const fetchUserData = async () => {
        try {
            const response = await api.get('/myapp/user-info/'); // Adjust endpoint if necessary
            setUserData(response.data);
            setFormData(response.data);
            parseAddress(response.data.address);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user info:', error);
            setLoading(false);
        }
    };

    // Parse the address string to set initial dropdown values
    const parseAddress = (address) => {
        if (!address) return;
        const parts = address.split(',').map(part => part.trim());

        // Extract House Number, Soi, Road if present
        const house = parts.find(part => part.startsWith('บ้านเลขที่'));
        const soiPart = parts.find(part => part.startsWith('ซอย'));
        const roadPart = parts.find(part => part.startsWith('ถนน'));
        const province = parts.find(part => part.startsWith('จังหวัด'));
        const amphure = parts.find(part => part.startsWith('อำเภอ'));
        const tambon = parts.find(part => part.startsWith('ตำบล'));
        const zipcode = parts.find(part => part.startsWith('รหัสไปรษณีย์'));

        setHouseNumber(house ? house.replace('บ้านเลขที่ : ', '') : '');
        setSoi(soiPart ? soiPart.replace('ซอย : ', '') : '');
        setRoad(roadPart ? roadPart.replace('ถนน : ', '') : '');
        setSelectedProvince(province ? province.replace('จังหวัด : ', '') : '');
        setSelectedAmphure(amphure ? amphure.replace('อำเภอ : ', '') : '');
        setSelectedTambon(tambon ? tambon.replace('ตำบล : ', '') : '');
        setSelectedZipcode(zipcode ? zipcode.replace('รหัสไปรษณีย์ : ', '') : '');
    };

    // Fetch province data from external API
    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
            const rawData = await response.text();
            const objectData = JSON.parse(rawData);
            setProvinces(objectData);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    // Handle province selection
    const handleProvinceChange = (e) => {
        const provinceName = e.target.value;
        setSelectedProvince(provinceName);
        setSelectedAmphure('');
        setSelectedTambon('');
        setSelectedZipcode('');

        const province = provinces.find(p => p.name_th === provinceName);
        if (province) {
            setAmphures(province.amphure);
        } else {
            setAmphures([]);
        }
        setTambons([]);
        setZipcodes([]);
    };

    // Handle amphure selection
    const handleAmphureChange = (e) => {
        const amphureName = e.target.value;
        setSelectedAmphure(amphureName);
        setSelectedTambon('');
        setSelectedZipcode('');

        const amphure = amphures.find(a => a.name_th === amphureName);
        if (amphure) {
            setTambons(amphure.tambon);
        } else {
            setTambons([]);
        }
        setZipcodes([]);
    };

    // Handle tambon selection
    const handleTambonChange = (e) => {
        const tambonName = e.target.value;
        setSelectedTambon(tambonName);
        setSelectedZipcode('');

        const tambon = tambons.find(t => t.name_th === tambonName);
        if (tambon) {
            setZipcodes([tambon.zip_code]);
        } else {
            setZipcodes([]);
        }
    };

    // Handle zipcode selection
    const handleZipcodeChange = (e) => {
        const zipcode = e.target.value;
        setSelectedZipcode(zipcode);
    };

    // Concatenate the address parts
    useEffect(() => {
        if (selectedProvince && selectedAmphure && selectedTambon && selectedZipcode) {
            let fullAddress = '';

            if (houseNumber) {
                fullAddress += `บ้านเลขที่ : ${houseNumber}, `;
            }
            if (soi) {
                fullAddress += `ซอย : ${soi}, `;
            }
            if (road) {
                fullAddress += `ถนน : ${road}, `;
            }
            fullAddress += `ตำบล : ${selectedTambon}, อำเภอ : ${selectedAmphure}, จังหวัด : ${selectedProvince}, รหัสไปรษณีย์ : ${selectedZipcode}`;

            setFormData(prevData => ({
                ...prevData,
                address: fullAddress
            }));
        }
    }, [selectedProvince, selectedAmphure, selectedTambon, selectedZipcode, houseNumber, soi, road]);

    // ฟังก์ชันสำหรับตรวจสอบหมายเลขโทรศัพท์มือถือ
    const validatePhoneNumber = (number) => {
        const phoneRegex = /0[2689]{1}[0-9]{8}/;
        return phoneRegex.test(number);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // ตรวจสอบเบอร์มือถือเมื่อมีการเปลี่ยนแปลง
        if (name === 'phone_number') {
            if (!validatePhoneNumber(value)) {
                setPhoneError('หมายเลขโทรศัพท์มือถือไม่ถูกต้อง');
            } else {
                setPhoneError('');
            }
        }
    };

    const handleHouseNumberChange = (e) => {
        const { value } = e.target;
        setHouseNumber(value);
    };

    const handleSoiChange = (e) => {
        const { value } = e.target;
        setSoi(value);
    };

    const handleRoadChange = (e) => {
        const { value } = e.target;
        setRoad(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบเบอร์มือถือก่อนส่งฟอร์ม
        if (!validatePhoneNumber(formData.phone_number)) {
            setPhoneError('หมายเลขโทรศัพท์มือถือไม่ถูกต้อง');
            return;
        }

        try {
            const response = await api.put('/myapp/user-info/', formData); // Adjust endpoint if necessary
            setUserData(response.data);
            setMessage('ข้อมูลถูกอัปเดตเรียบร้อยแล้ว!');
            setEditing(false);
        } catch (error) {
            console.error('Error updating user info:', error);
            setMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Nav username={userData.username} />
            <div className='setting-container'>
                <h1>Settings</h1>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit} className='form-setting'>
                    <div>
                        <label>First Name:</label>
                        {editing ? (
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <span>{userData.first_name}</span>
                        )}
                    </div>
                    <div>
                        <label>Last Name:</label>
                        {editing ? (
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        ) : (
                            <span>{userData.last_name}</span>
                        )}
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        {editing ? (
                            <div>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                    placeholder="เช่น 081-234-5678"
                                />
                                {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
                            </div>
                        ) : (
                            <span>{userData.phone_number}</span>
                        )}
                    </div>
                    <div>
                        <label>Address:</label>
                        {editing ? (
                            <div>
                                {/* House Number Input */}
                                <div>
                                    <label>บ้านเลขที่:</label>
                                    <input
                                        type="text"
                                        name="house_number"
                                        value={houseNumber}
                                        onChange={handleHouseNumberChange}
                                        placeholder="กรอกบ้านเลขที่"
                                    />
                                </div>
                                {/* Soi Input */}
                                <div>
                                    <label>ซอย:</label>
                                    <input
                                        type="text"
                                        name="soi"
                                        value={soi}
                                        onChange={handleSoiChange}
                                        placeholder="กรอกซอย"
                                    />
                                </div>
                                {/* Road Input */}
                                <div>
                                    <label>ถนน:</label>
                                    <input
                                        type="text"
                                        name="road"
                                        value={road}
                                        onChange={handleRoadChange}
                                        placeholder="กรอกถนน"
                                    />
                                </div>
                                {/* Province Dropdown */}
                                <div>
                                    <label>จังหวัด:</label>
                                    <select value={selectedProvince} onChange={handleProvinceChange} required>
                                        <option value="">เลือกจังหวัด</option>
                                        {provinces.map((province, index) => (
                                            <option key={index} value={province.name_th}>
                                                {province.name_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Amphure Dropdown */}
                                <div>
                                    <label>อำเภอ:</label>
                                    <select
                                        value={selectedAmphure}
                                        onChange={handleAmphureChange}
                                        disabled={!amphures.length}
                                        required
                                    >
                                        <option value="">เลือกอำเภอ</option>
                                        {amphures.map((amphure, index) => (
                                            <option key={index} value={amphure.name_th}>
                                                {amphure.name_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Tambon Dropdown */}
                                <div>
                                    <label>ตำบล:</label>
                                    <select
                                        value={selectedTambon}
                                        onChange={handleTambonChange}
                                        disabled={!tambons.length}
                                        required
                                    >
                                        <option value="">เลือกตำบล</option>
                                        {tambons.map((tambon, index) => (
                                            <option key={index} value={tambon.name_th}>
                                                {tambon.name_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Zipcode Dropdown */}
                                <div>
                                    <label>รหัสไปรษณีย์:</label>
                                    <select
                                        value={selectedZipcode}
                                        onChange={handleZipcodeChange}
                                        disabled={!zipcodes.length}
                                        required
                                    >
                                        <option value="">เลือกรหัสไปรษณีย์</option>
                                        {zipcodes.map((zipcode, index) => (
                                            <option key={index} value={zipcode}>
                                                {zipcode}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Read-only Address Field */}
                                <div>
                                    <label>ที่อยู่:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        readOnly
                                    />
                                </div>
                            </div>
                        ) : (
                            <span>{userData.address || 'N/A'}</span>
                        )}
                    </div>
                    {editing ? (
                        <>
                            <button type="submit">Save</button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData(userData);
                                    setHouseNumber('');
                                    setSoi('');
                                    setRoad('');
                                    // Reset address selections
                                    parseAddress(userData.address);
                                    setPhoneError('');
                                }}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button type="button" className="button-setting"onClick={() => setEditing(true)}>
                            Edit
                        </button>
                    )}
                </form>
            </div>


        </div>
    );

}

export default Settings;
