-- Create todos table
create table todos (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  task text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table todos enable row level security;

-- Create policies
create policy "Users can view their own todos" 
on todos for select 
using (auth.uid() = user_id);

create policy "Users can insert their own todos" 
on todos for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own todos" 
on todos for update 
using (auth.uid() = user_id);

create policy "Users can delete their own todos" 
on todos for delete 
using (auth.uid() = user_id);
