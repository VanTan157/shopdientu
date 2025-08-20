"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPatch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { loadingStore } from "@/app/store/loading.store";
import { IMobile } from "@/lib/types/mobile";

const EditMobile = ({
  mobile,
  children,
}: {
  mobile: IMobile;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { start, stop } = loadingStore();
  const [formData, setFormData] = useState({
    name: mobile.name,
    startingPrice: mobile.startingPrice,
    promotion: mobile.promotion,
    description: mobile.description || "",
    brand: mobile.brand || "",
    specifications: {
      screenSize: mobile.specifications.screenSize || 0,
      resolution: mobile.specifications.resolution || "",
      refreshRate: mobile.specifications.refreshRate || 0,
      simType: mobile.specifications.simType || "",
      ram: mobile.specifications.ram || 0,
      storage: mobile.specifications.storage || 0,
      battery: mobile.specifications.battery || 0,
      os: mobile.specifications.os || "",
      camera: {
        rear: mobile.specifications.camera.rear || "",
        front: mobile.specifications.camera.front || "",
      },
    },
    colorVariants: mobile.colorVariants.map((variant) => ({
      color: variant.color,
      image: null as File | null,
      stock: variant.stock,
      existingImage: variant.image || "",
      hasNewImage: "false",
    })),
    dimensions: {
      length: mobile.dimensions?.length || 0,
      width: mobile.dimensions?.width || 0,
      height: mobile.dimensions?.height || 0,
      weight: mobile.dimensions?.weight || 0,
    },
    warranty: mobile.warranty || "",
    accessories: mobile.accessories || [],
    tags: mobile.tags || [],
  });
  const [imagePreview, setImagePreview] = useState<string[]>(
    mobile.colorVariants.map((variant) =>
      variant.image
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`
        : ""
    )
  );
  const [tagInput, setTagInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreview]);

  const handleUpdateMobile = async () => {
    start();

    if (!formData.name.trim()) {
      toast.error("Tên điện thoại không được để trống!");
      stop();
      return;
    }
    if (
      typeof formData.startingPrice !== "number" ||
      isNaN(formData.startingPrice) ||
      formData.startingPrice <= 0
    ) {
      toast.error("Giá gốc phải là số lớn hơn 0!");
      stop();
      return;
    }
    if (
      typeof formData.promotion !== "number" ||
      isNaN(formData.promotion) ||
      formData.promotion < 0 ||
      formData.promotion > 100
    ) {
      toast.error("Khuyến mãi phải là số từ 0 đến 100!");
      stop();
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Mô tả không được để trống!");
      stop();
      return;
    }
    if (!formData.brand) {
      toast.error("Thương hiệu không được để trống!");
      stop();
      return;
    }
    const specs = formData.specifications;
    if (
      !specs.screenSize ||
      !specs.resolution ||
      !specs.simType ||
      !specs.ram ||
      !specs.storage ||
      !specs.battery ||
      !specs.os
    ) {
      toast.error("Vui lòng nhập đầy đủ thông số kỹ thuật!");
      stop();
      return;
    }
    if (
      !formData.colorVariants.length ||
      formData.colorVariants.some(
        (v) =>
          !v.color.trim() ||
          v.stock === undefined ||
          isNaN(Number(v.stock)) ||
          Number(v.stock) < 0 ||
          (!v.image && !v.existingImage)
      )
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh (hoặc ảnh hiện tại), và số lượng tồn kho hợp lệ!"
      );
      stop();
      return;
    }
    if (
      !formData.specifications.camera.rear.trim() ||
      !formData.specifications.camera.front.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin camera!");
      stop();
      return;
    }
    if (
      typeof formData.dimensions.weight !== "number" ||
      isNaN(formData.dimensions.weight) ||
      formData.dimensions.weight <= 0
    ) {
      toast.error("Trọng lượng phải là số lớn hơn 0!");
      stop();
      return;
    }
    if (formData.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      toast.error("Tag không hợp lệ!");
      stop();
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("startingPrice", formData.startingPrice.toString());
      formDataToSend.append("promotion", formData.promotion.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append("warranty", formData.warranty);
      formDataToSend.append(
        "accessories",
        JSON.stringify(formData.accessories)
      );
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append(
        "colorVariants",
        JSON.stringify(
          formData.colorVariants.map((variant) => ({
            color: variant.color,
            stock: variant.stock,
            existingImage: variant.existingImage,
            hasNewImage: variant.hasNewImage,
          }))
        )
      );

      // Append files
      formData.colorVariants.forEach((variant, index) => {
        if (variant.image) {
          formDataToSend.append("images", variant.image);
        }
      });

      const response = await apiPatch<IMobile, FormData>(
        `/mobiles/${mobile._id}`,
        formDataToSend
      );

      if (response.error) throw new Error(response.error);

      toast.success("Cập nhật điện thoại thành công!");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật điện thoại!");
    } finally {
      stop();
    }
  };

  const addColorVariant = () => {
    setFormData({
      ...formData,
      colorVariants: [
        ...formData.colorVariants,
        {
          color: "",
          image: null,
          stock: 0,
          existingImage: "",
          hasNewImage: "false",
        },
      ],
    });
    setImagePreview((prev) => [...prev, ""]);
  };

  const removeColorVariant = (index: number) => {
    setFormData({
      ...formData,
      colorVariants: formData.colorVariants.filter((_, i) => i !== index),
    });
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const handleAddAccessory = () => {
    if (accessoryInput && !formData.accessories.includes(accessoryInput)) {
      setFormData({
        ...formData,
        accessories: [...formData.accessories, accessoryInput],
      });
      setAccessoryInput("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] !max-w-[90%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chỉnh sửa điện thoại: {mobile.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          {/* Tên */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium mb-2">
              Tên điện thoại
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên điện thoại"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Thương hiệu */}
          <div>
            <Label htmlFor="brand" className="text-gray-700 font-medium">
              Thương hiệu
            </Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder="Nhập thương hiệu"
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Giá gốc */}
          <div>
            <Label
              htmlFor="startingPrice"
              className="text-gray-700 font-medium mb-2"
            >
              Giá gốc (VNĐ)
            </Label>
            <Input
              id="startingPrice"
              type="text"
              value={formData.startingPrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startingPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập giá gốc"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Khuyến mãi */}
          <div>
            <Label
              htmlFor="promotion"
              className="text-gray-700 font-medium mb-2"
            >
              Khuyến mãi (%)
            </Label>
            <Input
              id="promotion"
              type="text"
              value={formData.promotion || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promotion: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập % khuyến mãi (nếu có)"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <Label
              htmlFor="description"
              className="text-gray-700 font-medium mb-2"
            >
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Thông số kỹ thuật */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">
              Thông số kỹ thuật
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium">
                  Kích thước màn hình (inch)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="6.1"
                  value={formData.specifications.screenSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        screenSize: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">
                  Độ phân giải
                </Label>
                <Input
                  placeholder="1170 x 2532 pixels"
                  value={formData.specifications.resolution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        resolution: e.target.value,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">
                  Tần số quét (Hz)
                </Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={formData.specifications.refreshRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        refreshRate: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Loại SIM</Label>
                <Input
                  placeholder="Nano SIM"
                  value={formData.specifications.simType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        simType: e.target.value,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">RAM (GB)</Label>
                <Input
                  type="number"
                  placeholder="8"
                  value={formData.specifications.ram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        ram: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Bộ nhớ (GB)</Label>
                <Input
                  type="number"
                  placeholder="256"
                  value={formData.specifications.storage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        storage: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Pin (mAh)</Label>
                <Input
                  type="number"
                  placeholder="4000"
                  value={formData.specifications.battery}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        battery: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">
                  Hệ điều hành
                </Label>
                <Input
                  placeholder="iOS 17"
                  value={formData.specifications.os}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        os: e.target.value,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Camera */}
            <div className="space-y-2">
              <Label className="text-gray-900 font-semibold">Camera</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium">
                    Camera sau
                  </Label>
                  <Input
                    placeholder="48MP + 12MP + 12MP"
                    value={formData.specifications.camera.rear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          camera: {
                            ...formData.specifications.camera,
                            rear: e.target.value,
                          },
                        },
                      })
                    }
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">
                    Camera trước
                  </Label>
                  <Input
                    placeholder="12MP"
                    value={formData.specifications.camera.front}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          camera: {
                            ...formData.specifications.camera,
                            front: e.target.value,
                          },
                        },
                      })
                    }
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kích thước và trọng lượng */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">
              Kích thước và trọng lượng
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium">Dài (mm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="146.7"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        length: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Rộng (mm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="71.5"
                  value={formData.dimensions.width}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        width: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Dày (mm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="7.8"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        height: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">
                  Trọng lượng (g)
                </Label>
                <Input
                  type="number"
                  placeholder="194"
                  value={formData.dimensions.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        weight: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bảo hành */}
          <div>
            <Label htmlFor="warranty" className="text-gray-700 font-medium">
              Bảo hành
            </Label>
            <Input
              id="warranty"
              value={formData.warranty}
              onChange={(e) =>
                setFormData({ ...formData, warranty: e.target.value })
              }
              placeholder="12 tháng"
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Biến thể màu */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">
              Biến thể màu
            </Label>
            {formData.colorVariants.map((variant, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm"
              >
                <Input
                  placeholder="Tên màu"
                  value={variant.color}
                  onChange={(e) => {
                    const newVariants = [...formData.colorVariants];
                    newVariants[index].color = e.target.value;
                    setFormData({ ...formData, colorVariants: newVariants });
                  }}
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex-1">
                  {(variant.existingImage || imagePreview[index]) && (
                    <Image
                      src={
                        imagePreview[index]
                          ? imagePreview[index]
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.existingImage}`
                      }
                      alt={variant.color}
                      width={100}
                      height={100}
                      className="object-contain rounded-md"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      const newVariants = [...formData.colorVariants];
                      newVariants[index].image = file;
                      newVariants[index].hasNewImage = file ? "true" : "false";
                      setFormData({ ...formData, colorVariants: newVariants });
                      if (file) {
                        setImagePreview((prev) => {
                          const updatedPreviews = [...prev];
                          updatedPreviews[index] = URL.createObjectURL(file);
                          return updatedPreviews;
                        });
                      }
                    }}
                    className="mt-2"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Tồn kho"
                  value={variant.stock || ""}
                  onChange={(e) => {
                    const newVariants = [...formData.colorVariants];
                    newVariants[index].stock = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, colorVariants: newVariants });
                  }}
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.colorVariants.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColorVariant(index)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addColorVariant}
              className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm màu
            </Button>
          </div>

          {/* Phụ kiện */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">Phụ kiện</Label>
            <div className="flex gap-2">
              <Input
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                placeholder="Nhập phụ kiện và nhấn Thêm"
                onKeyDown={(e) => e.key === "Enter" && handleAddAccessory()}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddAccessory}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.accessories.map((accessory, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {accessory}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        accessories: formData.accessories.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="text-red-600"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Nhập tag và nhấn Thêm"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddTag}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== index),
                      })
                    }
                    className="text-red-600"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Nút submit */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateMobile}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMobile;
