import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EntityCrudPage({
  entityKey,
  title,
  pluralLabel,
  listData,
  fields,
  emptyItem,
  toRoute,
  tableColumns,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const storageKey = `nbro_${entityKey}_records`;

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : listData;
    } catch {
      return listData;
    }
  });

  const [form, setForm] = useState(emptyItem);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (!isEditing) {
      setForm(emptyItem);
      return;
    }

    const match = items.find((item) => {
      const lookup =
        item.id ||
        item.site_id ||
        item.profile_id ||
        item.notice_id ||
        item.defect_id ||
        item.building_id ||
        item.structure_id ||
        item.service_id;
      return lookup === id;
    });

    setForm(match || emptyItem);
  }, [id, isEditing, items, emptyItem]);

  const visibleColumns = useMemo(() => {
    if (tableColumns?.length) return tableColumns;
    return fields.map((field) => field.label);
  }, [fields, tableColumns]);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEditing) {
      setItems((current) =>
        current.map((item) => {
          const lookup =
            item.id ||
            item.site_id ||
            item.profile_id ||
            item.notice_id ||
            item.defect_id ||
            item.building_id ||
            item.structure_id ||
            item.service_id;
          return lookup === id ? { ...item, ...form } : item;
        }),
      );
    } else {
      const newId = crypto.randomUUID();
      const nextItem = {
        ...form,
        id: newId,
        site_id: form.site_id || newId,
        profile_id: form.profile_id || newId,
        notice_id: form.notice_id || newId,
        defect_id: form.defect_id || newId,
        building_id: form.building_id || newId,
        structure_id: form.structure_id || newId,
        service_id: form.service_id || newId,
      };
      setItems((current) => [nextItem, ...current]);
    }

    navigate(toRoute);
  };

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const handleDelete = (item) => {
    const identifier =
      item.id ||
      item.site_id ||
      item.profile_id ||
      item.notice_id ||
      item.defect_id ||
      item.building_id ||
      item.structure_id ||
      item.service_id;

    setItems((current) =>
      current.filter((entry) => {
        const rowId =
          entry.id ||
          entry.site_id ||
          entry.profile_id ||
          entry.notice_id ||
          entry.defect_id ||
          entry.building_id ||
          entry.structure_id ||
          entry.service_id;
        return rowId !== identifier;
      }),
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">{pluralLabel}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{title}</h1>
          </div>
          <Link
            to={toRoute}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to list
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? `Edit ${title}` : `Create ${title}`}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key} className={field.fullWidth ? "md:col-span-2" : ""}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>

                    {field.type === "textarea" ? (
                      <textarea
                        value={form[field.key] ?? ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        rows={field.rows || 4}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={form[field.key] ?? field.options[0]?.value ?? ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "boolean" ? (
                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(form[field.key])}
                          onChange={(e) => updateField(field.key, e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {field.label}
                      </label>
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={form[field.key] ?? ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
                >
                  {isEditing ? "Save changes" : "Create record"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(toRoute)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Recent records</h2>
            </div>

            <div className="space-y-3 p-4">
              {items.slice(0, 6).map((item) => {
                const displayField = fields.find((field) => field.primary)?.key || fields[0]?.key;
                const name = renderValue(
                  item[displayField] ||
                    item.owner_name ||
                    item.full_name ||
                    item.title ||
                    item.notation ||
                    item.site_ref ||
                    item.building_id,
                );
                const idValue =
                  item.id ||
                  item.site_id ||
                  item.profile_id ||
                  item.notice_id ||
                  item.defect_id ||
                  item.building_id ||
                  item.structure_id ||
                  item.service_id;

                return (
                  <div key={idValue} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-800">{name}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{idValue}</div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`${toRoute}/${idValue}/edit`}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-slate-900">All {pluralLabel}</h2>
            <Link
              to={`${toRoute}/new`}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
            >
              + New record
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  {visibleColumns.map((column) => (
                    <th key={column} className="px-6 py-3 font-semibold">
                      {column}
                    </th>
                  ))}
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const idValue =
                    item.id ||
                    item.site_id ||
                    item.profile_id ||
                    item.notice_id ||
                    item.defect_id ||
                    item.building_id ||
                    item.structure_id ||
                    item.service_id;

                  return (
                    <tr key={idValue} className="border-t border-slate-200 hover:bg-slate-50">
                      {visibleColumns.map((column) => {
                        const key = fields.find((field) => field.label === column)?.key || column;
                        return <td key={`${idValue}-${key}`} className="px-6 py-4">{renderValue(item[key])}</td>;
                      })}

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`${toRoute}/${idValue}/edit`}
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

