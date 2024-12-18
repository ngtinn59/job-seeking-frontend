import { Space, Table, TableProps, Tooltip } from "antd";
import { MdSearch } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";

import { VscSaveAs } from "react-icons/vsc";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { formatCurrencyVND } from "../../utils/function/formatCurrency";
import {
  getAllProfileSaved,
  unSaveProfile,
} from "../../services/api/employer/profileSaved";
import toast from "react-hot-toast";
import ModalViewProfileCandidate from "./Modal/ModalViewProfileCandidate";
import ModalSendMail from "./Modal/ModalSendMail";

export interface ICandidateProfileSaved {
  id: number;
  desired_position: string;
  name: string;
  salary: {
    salary_from: number;
    salary_to: number;
  };
  experience_level: string;
  district: string;
  created_at: string;
}

export interface IMailReq {
  subject: string;
  message: string;
}

const ProfileSaved: React.FC = () => {
  const LIMIT = 10;
  const [open, setOpen] = useState<boolean>(false);
  const [openMail, setOpenMail] = useState<boolean>(false);
  const [data, setData] = useState<ICandidateProfileSaved[]>([]);
  const [filteredData, setFilteredData] = useState<ICandidateProfileSaved[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(LIMIT);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [dataDetail, setDataDetail] = useState<ICandidateProfileSaved | null>(
    null
  );

  const fetchListProfileSaved = async () => {
    setLoading(true);
    try {
      const res = await getAllProfileSaved();
      if (res.status_code === 200) {
        setData(res.data);
        setTotal(res.data.length);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListProfileSaved();
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const lowerSearch = value.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.desired_position.toLowerCase().includes(lowerSearch)
      );
      setFilteredData(filtered);
      setTotal(filtered.length);
    }, 300),
    [data]
  );

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const handleUnSaveProfile = async (id: number) => {
    try {
      const res = await unSaveProfile(id);
      if (res && res.status_code === 200) {
        toast.success(res.message || "Unsave profile successfully");
        fetchListProfileSaved();
      }
    } catch (error) {
      console.log(error);
      toast.error("Unsave profile failed");
      fetchListProfileSaved();
    }
  };

  const columns: TableProps<ICandidateProfileSaved>["columns"] = [
    {
      title: "No.",
      key: "STT",
      width: 50,
      align: "center",
      render: (_, __, index) => (
        <span className="font-semibold">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Candidate Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Desired Position",
      dataIndex: "desired_position",
      key: "desired_position",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (salary: { salary_from: number; salary_to: number }) => (
        <span>
          {formatCurrencyVND(salary.salary_from)} -{" "}
          {formatCurrencyVND(salary.salary_to)}
        </span>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience_level",
      key: "experience_level",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",

      render: (created_at: string) => (
        <span>
          {created_at ? (
            <>
              {new Date(created_at).toLocaleTimeString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </>
          ) : (
            "--"
          )}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 200,
      align: "center",
      render: (_, record: ICandidateProfileSaved) => (
        <Space size="middle">
          <Tooltip title={`View profile of ${record.name}`}>
            <button
              onClick={() => {
                setDataDetail(record);
                setOpen(true);
              }}
              className="text-xl text-blue-500"
            >
              <FaEye />
            </button>
          </Tooltip>
          <Tooltip title={`Send mail to ${record.name}`}>
            <button
              onClick={() => {
                setDataDetail(record);
                setOpenMail(true);
              }}
              className="text-xl text-yellow-500"
            >
              <RiMailSendLine />
            </button>
          </Tooltip>
          <Tooltip title={`Unsave profile of ${record.name}`}>
            <button
              onClick={() => {
                handleUnSaveProfile(record?.id);
              }}
              className="px-2 mb-1 text-red-500 flex items-center justify-center gap-1 border border-red-500 border-solid rounded-md"
            >
              <VscSaveAs className="text-lg" />
              <span>Unsave</span>
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-8 py-5 min-h-screen">
      <div className="uppercase text-lg font-semibold">Profile Saved</div>
      <div className="my-4 flex items-center justify-between">
        <div className="flex w-full justify-end items-center">
          <div className="relative h-full">
            <input
              type="text"
              value={search}
              placeholder={"Candidate name or desired position"}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-4.5 mr-8 w-80 rounded-md border border-solid border-gray-500 px-2.5 py-2 outline-none"
            />
            <button className="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-e-md border-gray-500 bg-gray-500 text-xl text-white">
              <MdSearch />
            </button>
          </div>
        </div>
      </div>
      <Table<ICandidateProfileSaved>
        rowKey="id"
        size="middle"
        bordered
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        pagination={{
          total: total,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "30"],
          onShowSizeChange(current, size) {
            setCurrentPage(1);
            setPageSize(size);
          },
          showTotal: (total) => `Total: ${total}`,
          onChange(page, pageSize) {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />
      <ModalViewProfileCandidate
        data={dataDetail}
        setData={setDataDetail}
        open={open}
        setOpen={setOpen}
      />
      <ModalSendMail
        data={dataDetail}
        setData={setDataDetail}
        open={openMail}
        setOpen={setOpenMail}
      />
    </div>
  );
};

export default ProfileSaved;
