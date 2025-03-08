"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUpload, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

interface CarFormProps {
  car?: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    color: string;
    type: string;
    images: string[];
    description: string;
    stock: number;
  };
}

export default function CarForm({ car }: CarFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(car?.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: car || {
      name: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      color: "",
      type: "",
      description: "",
      stock: 1,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement form submission
      toast.success(car ? "Cập nhật xe thành công" : "Thêm xe mới thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      // TODO: Implement image upload to Firebase Storage
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      toast.error("Có lỗi khi tải ảnh lên");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên xe
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Vui lòng nhập tên xe" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            Hãng xe
          </label>
          <select
            id="brand"
            {...register("brand", { required: "Vui lòng chọn hãng xe" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            <option value="">Chọn hãng xe</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="mercedes">Mercedes</option>
            <option value="bmw">BMW</option>
          </select>
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text"
            id="model"
            {...register("model", { required: "Vui lòng nhập model xe" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Năm sản xuất
          </label>
          <input
            type="number"
            id="year"
            {...register("year", {
              required: "Vui lòng nhập năm sản xuất",
              min: {
                value: 2000,
                message: "Năm sản xuất phải từ 2000 trở lên",
              },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Giá (VNĐ)
          </label>
          <input
            type="number"
            id="price"
            {...register("price", {
              required: "Vui lòng nhập giá xe",
              min: {
                value: 0,
                message: "Giá xe phải lớn hơn 0",
              },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Màu sắc
          </label>
          <input
            type="text"
            id="color"
            {...register("color", { required: "Vui lòng nhập màu xe" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Loại xe
          </label>
          <select
            id="type"
            {...register("type", { required: "Vui lòng chọn loại xe" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            <option value="">Chọn loại xe</option>
            <option value="SUV">SUV</option>
            <option value="SEDAN">Sedan</option>
            <option value="COUPE">Coupe</option>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Số lượng tồn kho
          </label>
          <input
            type="number"
            id="stock"
            {...register("stock", {
              required: "Vui lòng nhập số lượng tồn kho",
              min: {
                value: 0,
                message: "Số lượng tồn kho phải lớn hơn hoặc bằng 0",
              },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description", { required: "Vui lòng nhập mô tả xe" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
        <div className="mt-2 flex items-center space-x-4">
          <label className="flex cursor-pointer items-center space-x-2 rounded-md border border-gray-300 px-4 py-2 hover:border-primary-500">
            <FaUpload />
            <span>Tải ảnh lên</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          {images.length > 0 && (
            <p className="text-sm text-gray-500">{images.length} ảnh đã chọn</p>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`Car image ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <span>{car ? "Cập nhật" : "Thêm mới"}</span>
          )}
        </button>
      </div>
    </form>
  );
} 